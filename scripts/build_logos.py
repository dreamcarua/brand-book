#!/usr/bin/env python3
"""
Будує SVG лого з вбудованими paths Archivo Black.
Жодної залежності від системних шрифтів — все це чистий вектор.

Принципи геометрії:
- DREAMCAR — одне слово, без пробілу між DREAM і CAR
- UA-блок у racing plate = квадрат (висота=ширина)
- DC monogram — щільно, без spacing
- Центрування — точне математичне
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WOFF = ROOT / "tmp-fonts/package/files/archivo-black-latin-400-normal.woff"
LOGO = ROOT / "assets/logo"

font = TTFont(str(WOFF))
gset = font.getGlyphSet()
cmap = font.getBestCmap()
UPM = font['head'].unitsPerEm   # 1000 units/em
CAP = font['OS/2'].sCapHeight   # 688 — висота заголовкових літер
ASC = font['hhea'].ascent       # 878

LETTERS = {}
for ch in "DREAMCARUO":
    gid = cmap[ord(ch)]
    glyph = gset[gid]
    pen = SVGPathPen(gset)
    glyph.draw(pen)
    LETTERS[ch] = (pen.getCommands(), glyph.width)

def text_paths(text, font_size, x, baseline_y, fill):
    """Повертає (paths_list, end_x) — текст без додаткового spacing.
    baseline_y — Y базової лінії (нижнього краю заголовкових літер)."""
    s = font_size / UPM
    out = []
    cur_x = x
    for ch in text:
        path, width = LETTERS[ch]
        out.append(
            f'<path transform="translate({cur_x:.2f} {baseline_y:.2f}) '
            f'scale({s:.4f} {-s:.4f})" d="{path}" fill="{fill}"/>'
        )
        cur_x += width * s
    return out, cur_x

def text_width(text, font_size):
    s = font_size / UPM
    return sum(LETTERS[c][1] for c in text) * s

def visual_left_pad(ch, font_size):
    """Реальний лівий відступ всередині advance-width — для precise центрування."""
    # Не критично для DREAMCAR одним блоком; спрощено повертає 0.
    return 0

# ----------------------------------------------------------------------------
# 1) RACING PLATE
# ----------------------------------------------------------------------------
def build_racing_plate():
    W, H = 720, 200
    plate_w, plate_h = 692, 172     # сама плата (всередині viewBox, лишається 14 px на shadow)
    inner = 20                       # внутрішній padding плати
    inner_h = plate_h - 2*inner     # 132 — висота для UA-блоку та тексту
    ua_size = inner_h               # 132×132 — квадрат
    text_pad = 16                    # відступ між UA-блоком і текстом + правий padding
    text_area_w = plate_w - inner - ua_size - text_pad - inner    # доступна ширина для DREAMCAR

    # Підбираємо font-size так, щоб DREAMCAR (8 літер БЕЗ пробілу) поміщався у text_area
    # з мінімальним лівим/правим запасом
    BRAND = "DREAMCAR"
    # знайдемо font-size де ширина = 96% text_area
    target = text_area_w * 0.96
    fs_brand = target / sum(LETTERS[c][1] for c in BRAND) * UPM
    brand_w = text_width(BRAND, fs_brand)

    text_x = inner + ua_size + text_pad + (text_area_w - brand_w) / 2
    # Y baseline DREAMCAR: вертикальне центрування cap-height у inner_h
    baseline_brand = inner + (inner_h + fs_brand * CAP/UPM) / 2

    # UA-tag — впишемо текст «UA» у квадрат із 14% padding
    ua_text_w_units = LETTERS["U"][1] + LETTERS["A"][1]
    ua_inner_target = ua_size * 0.62                      # 62% від UA-block
    fs_ua = ua_inner_target / ua_text_w_units * UPM
    ua_text_w = text_width("UA", fs_ua)
    ua_text_x = inner + (ua_size - ua_text_w) / 2
    baseline_ua = inner + (ua_size + fs_ua * CAP/UPM) / 2

    # До split: DREAM(white) + CAR(red), точно встик
    dream_paths, dream_end = text_paths("DREAM", fs_brand, text_x, baseline_brand, "#FFFFFF")
    car_paths, _   = text_paths("CAR",   fs_brand, dream_end, baseline_brand, "#E30613")
    ua_paths, _    = text_paths("UA",    fs_ua,    ua_text_x, baseline_ua,    "#FFFFFF")

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="DreamCar Racing Plate">
  <title>DreamCar — клуб дій з вручення авто</title>
  <!-- offset shadow (гострі кути) -->
  <rect x="14" y="14" width="{plate_w}" height="{plate_h}" fill="#B8050F"/>
  <!-- main plate -->
  <rect x="0" y="0" width="{plate_w}" height="{plate_h}" fill="#0A0A0A"/>
  <rect x="3" y="3" width="{plate_w-6}" height="{plate_h-6}" fill="none" stroke="#FFFFFF" stroke-width="6"/>
  <!-- UA tag (квадрат, гострі кути) -->
  <rect x="{inner}" y="{inner}" width="{ua_size}" height="{ua_size}" fill="#E30613"/>
  {chr(10).join("  " + p for p in ua_paths)}
  {chr(10).join("  " + p for p in dream_paths + car_paths)}
</svg>
'''

# ----------------------------------------------------------------------------
# 2) AVATAR CIRCLE — UA на верху, DC monogram, DREAMCAR внизу
# ----------------------------------------------------------------------------
def build_avatar_circle():
    W = H = 400
    cx, cy = W/2, H/2
    inner_radius = 184       # внутрішній край білої рамки

    # === UA tag — квадрат, прибл. 22% від diameter ===
    ua_box_size = 80
    ua_box_x = cx - ua_box_size/2
    ua_box_y = 60
    ua_text_w_units = LETTERS["U"][1] + LETTERS["A"][1]
    fs_ua = ua_box_size * 0.58 / ua_text_w_units * UPM
    ua_text_w = text_width("UA", fs_ua)
    ua_text_x = ua_box_x + (ua_box_size - ua_text_w) / 2
    baseline_ua = ua_box_y + (ua_box_size + fs_ua * CAP/UPM) / 2

    # === DC monogram у центрі (~78% від внутрішнього диаметра) ===
    inner_diameter = inner_radius * 2
    target_dc = inner_diameter * 0.78
    dc_text_units = LETTERS["D"][1] + LETTERS["C"][1]
    fs_dc = target_dc / dc_text_units * UPM
    dc_w = text_width("DC", fs_dc)
    dc_x = cx - dc_w/2
    baseline_dc = cy + fs_dc * CAP/UPM / 2 + 6   # трошки нижче центру кола

    # === DREAMCAR внизу ===
    fs_brand = 24
    brand_w = text_width("DREAMCAR", fs_brand)
    brand_x = cx - brand_w/2
    baseline_brand = 332

    ua_paths, _ = text_paths("UA", fs_ua, ua_text_x, baseline_ua, "#FFFFFF")
    d_paths, dx_end = text_paths("D", fs_dc, dc_x, baseline_dc, "#FFFFFF")
    c_paths, _ = text_paths("C", fs_dc, dx_end, baseline_dc, "#E30613")
    brand_paths, _ = text_paths("DREAMCAR", fs_brand, brand_x, baseline_brand, "#FFFFFF")

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="DreamCar Avatar Circle">
  <title>DreamCar — кругла аватарка з UA tag і DC monogram</title>
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E30613" stop-opacity="0.18"/>
      <stop offset="70%" stop-color="#E30613" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#E30613" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="{cx}" cy="{cy}" r="200" fill="url(#glow)"/>
  <circle cx="{cx}" cy="{cy}" r="190" fill="#0A0A0A"/>
  <circle cx="{cx}" cy="{cy}" r="{inner_radius}" fill="none" stroke="#FFFFFF" stroke-width="8"/>
  <rect x="{ua_box_x}" y="{ua_box_y}" width="{ua_box_size}" height="{ua_box_size}" fill="#E30613"/>
  {chr(10).join("  " + p for p in ua_paths)}
  {chr(10).join("  " + p for p in d_paths + c_paths)}
  {chr(10).join("  " + p for p in brand_paths)}
</svg>
'''

# ----------------------------------------------------------------------------
# 3) AVATAR MARK — лише DC monogram, центровано
# ----------------------------------------------------------------------------
def build_avatar_mark():
    W = H = 400
    cx, cy = W/2, H/2

    # Цілимось у ~80% від диаметра внутр. кола (360 px) — як на сайті
    target = 360 * 0.80
    dc_text_units = LETTERS["D"][1] + LETTERS["C"][1]
    fs_dc = target / dc_text_units * UPM
    dc_w = text_width("DC", fs_dc)
    dc_x = cx - dc_w/2
    baseline_dc = cy + fs_dc * CAP/UPM / 2

    d_paths, dx_end = text_paths("D", fs_dc, dc_x, baseline_dc, "#FFFFFF")
    c_paths, _ = text_paths("C", fs_dc, dx_end, baseline_dc, "#E30613")

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="DreamCar DC Monogram">
  <title>DreamCar — DC monogram</title>
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#E30613" stop-opacity="0.22"/>
      <stop offset="65%" stop-color="#E30613" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#E30613" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="{cx}" cy="{cy}" r="200" fill="url(#glow)"/>
  <circle cx="{cx}" cy="{cy}" r="186" fill="#0A0A0A"/>
  <circle cx="{cx}" cy="{cy}" r="180" fill="none" stroke="#FFFFFF" stroke-width="10"/>
  {chr(10).join("  " + p for p in d_paths + c_paths)}
</svg>
'''

# ----------------------------------------------------------------------------
# 4) FAVICON — мала версія DC monogram (100×100)
# ----------------------------------------------------------------------------
def build_favicon():
    W = H = 100
    cx, cy = 50, 50
    fs = 56
    dc_w = text_width("DC", fs)
    dc_x = cx - dc_w/2
    baseline_dc = cy + fs * CAP/UPM / 2

    d_paths, dx_end = text_paths("D", fs, dc_x, baseline_dc, "#FFFFFF")
    c_paths, _ = text_paths("C", fs, dx_end, baseline_dc, "#E30613")

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
  <circle cx="{cx}" cy="{cy}" r="49" fill="none" stroke="#E30613" stroke-width="2"/>
  <circle cx="{cx}" cy="{cy}" r="46" fill="#0A0A0A" stroke="#FFFFFF" stroke-width="3"/>
  {chr(10).join("  " + p for p in d_paths + c_paths)}
</svg>
'''

(LOGO / "dreamcar-racing-plate.svg").write_text(build_racing_plate(), encoding="utf-8")
(LOGO / "dreamcar-avatar-circle.svg").write_text(build_avatar_circle(), encoding="utf-8")
(LOGO / "dreamcar-avatar-mark.svg").write_text(build_avatar_mark(), encoding="utf-8")
(ROOT / "favicon.svg").write_text(build_favicon(), encoding="utf-8")

print("✓ racing-plate.svg")
print("✓ avatar-circle.svg")
print("✓ avatar-mark.svg")
print("✓ favicon.svg")
print(f"\nКлючові метрики Archivo Black: UPM={UPM}, capHeight={CAP}, ascender={ASC}")

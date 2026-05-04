#!/usr/bin/env python3
"""
Будує SVG лого з ВБУДОВАНИМИ paths Archivo Black — без залежності від шрифтів.
Чистий вектор. Однаковий вигляд на будь-якій системі.
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from pathlib import Path

ROOT = Path("/sessions/happy-wonderful-einstein/mnt/DreamCar.AI/dreamcar-brand-book")
WOFF = ROOT / "tmp-fonts/package/files/archivo-black-latin-400-normal.woff"
LOGO = ROOT / "assets/logo"

font = TTFont(str(WOFF))
gset = font.getGlyphSet()
cmap = font.getBestCmap()
UPM = font['head'].unitsPerEm  # 1000

def glyph_data(ch):
    gid = cmap[ord(ch)]
    glyph = gset[gid]
    pen = SVGPathPen(gset)
    glyph.draw(pen)
    return pen.getCommands(), glyph.width

# Кешую дані для всіх потрібних літер
LETTERS = {}
for ch in "DREAMCARUO":
    p, w = glyph_data(ch)
    LETTERS[ch] = (p, w)

def text_paths(text, font_size, x, y, fill):
    """Повертає список <path> елементів для тексту, починаючи з (x, y).
    y — baseline."""
    s = font_size / UPM
    out = []
    cur_x = x
    for ch in text:
        if ch == " ":
            cur_x += font_size * 0.3
            continue
        path, width = LETTERS[ch]
        # transform: спочатку translate (cur_x, y), потім scale(s, -s) — flip y
        out.append(
            f'<path transform="translate({cur_x:.2f} {y:.2f}) scale({s:.4f} {-s:.4f})" '
            f'd="{path}" fill="{fill}"/>'
        )
        cur_x += width * s
    return out, cur_x  # (paths, end_x)

def text_width(text, font_size):
    s = font_size / UPM
    return sum(LETTERS[c][1] for c in text if c != " ") * s

# ---------------------------------------------------------------------------
# 1) RACING PLATE — горизонтальний номерний знак
# ---------------------------------------------------------------------------
def build_racing_plate():
    W, H = 720, 200
    plate_w, plate_h = 692, 172
    ua_w = 120
    fs_brand = 80
    fs_ua = 64

    # Y-baseline для тексту (cap height vertically центрована)
    # cap height = 688 unit * (fs/1000) = fs*0.688
    baseline_brand = (plate_h + fs_brand * 0.688) / 2  # центр виско vertically
    baseline_ua = (plate_h + fs_ua * 0.688) / 2

    # DREAM
    dream_w = text_width("DREAM", fs_brand)
    car_w = text_width("CAR", fs_brand)
    text_area = plate_w - ua_w - 24  # 12 padding з кожного боку
    spacing = (text_area - dream_w - car_w) / 2  # центрування DREAMCAR в text area

    # Координати для UA (у червоному квадраті розміром ua_w × plate_h)
    ua_w_text = text_width("UA", fs_ua)
    ua_x = (ua_w - ua_w_text) / 2

    # Координати для DREAM
    dream_x = ua_w + 12 + spacing
    car_x = dream_x + dream_w + spacing

    dream_paths, _ = text_paths("DREAM", fs_brand, dream_x, baseline_brand, "#FFFFFF")
    car_paths, _   = text_paths("CAR",   fs_brand, car_x,   baseline_brand, "#E30613")
    ua_paths, _    = text_paths("UA",    fs_ua,    ua_x,    baseline_ua,    "#FFFFFF")

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="DreamCar Racing Plate">
  <title>DreamCar — клуб дій з вручення авто</title>
  <!-- offset shadow -->
  <rect x="14" y="14" width="{plate_w}" height="{plate_h}" rx="6" fill="#B8050F"/>
  <!-- main plate -->
  <rect x="0" y="0" width="{plate_w}" height="{plate_h}" rx="6" fill="#0A0A0A"/>
  <rect x="3" y="3" width="{plate_w-6}" height="{plate_h-6}" rx="4" fill="none" stroke="#FFFFFF" stroke-width="6"/>
  <!-- UA tag -->
  <rect x="{(plate_h-ua_w)/2 - (plate_h-ua_w)/2 + 0}" y="{(plate_h - ua_w)/2 + 0}" width="0" height="0" fill="none"/>
  <rect x="20" y="20" width="{ua_w-40}" height="{plate_h-40}" rx="2" fill="#E30613" />
  <!-- ↑ виправлю на нормальний UA-блок -->
'''
    # Перепишу UA-блок чисто
    ua_block_x, ua_block_y = 20, 20
    ua_block_w, ua_block_h = 100, plate_h - 40
    ua_text_x = ua_block_x + (ua_block_w - ua_w_text) / 2
    ua_text_y = ua_block_y + (ua_block_h + fs_ua*0.688) / 2

    paths_combined = "\n  ".join(dream_paths + car_paths)
    ua_text_paths, _ = text_paths("UA", fs_ua, ua_text_x, ua_text_y, "#FFFFFF")
    ua_block_paths = "\n  ".join(ua_text_paths)

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="DreamCar Racing Plate">
  <title>DreamCar — клуб дій з вручення авто</title>
  <rect x="14" y="14" width="{plate_w}" height="{plate_h}" rx="6" fill="#B8050F"/>
  <rect x="0" y="0" width="{plate_w}" height="{plate_h}" rx="6" fill="#0A0A0A"/>
  <rect x="3" y="3" width="{plate_w-6}" height="{plate_h-6}" rx="4" fill="none" stroke="#FFFFFF" stroke-width="6"/>
  <rect x="{ua_block_x}" y="{ua_block_y}" width="{ua_block_w}" height="{ua_block_h}" rx="2" fill="#E30613"/>
  {ua_block_paths}
  {paths_combined}
</svg>
'''

# ---------------------------------------------------------------------------
# 2) AVATAR CIRCLE — круглий з UA + DC + DREAMCAR
# ---------------------------------------------------------------------------
def build_avatar_circle():
    W = H = 400
    cx, cy = W/2, H/2

    # UA-tag
    ua_w_box, ua_h_box = 84, 48
    ua_x_box = cx - ua_w_box/2
    ua_y_box = 58
    fs_ua = 36
    ua_text_w = text_width("UA", fs_ua)
    ua_text_x = ua_x_box + (ua_w_box - ua_text_w) / 2
    ua_text_y = ua_y_box + (ua_h_box + fs_ua*0.688) / 2

    # DC monogram
    fs_dc = 144
    d_w = LETTERS["D"][1] * fs_dc / UPM
    c_w = LETTERS["C"][1] * fs_dc / UPM
    spacing = 8
    total_dc = d_w + c_w + spacing
    d_x = cx - total_dc/2
    c_x = d_x + d_w + spacing
    dc_y = cy + fs_dc*0.688/2  # baseline

    # DREAMCAR (нижче)
    fs_brand = 22
    brand_w = text_width("DREAMCAR", fs_brand)
    brand_x = cx - brand_w/2
    brand_y = 320

    ua_paths, _ = text_paths("UA", fs_ua, ua_text_x, ua_text_y, "#FFFFFF")
    d_paths, _ = text_paths("D", fs_dc, d_x, dc_y, "#FFFFFF")
    c_paths, _ = text_paths("C", fs_dc, c_x, dc_y, "#E30613")
    brand_paths, _ = text_paths("DREAMCAR", fs_brand, brand_x, brand_y, "#FFFFFF")

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
  <circle cx="{cx}" cy="{cy}" r="184" fill="none" stroke="#FFFFFF" stroke-width="8"/>
  <rect x="{ua_x_box}" y="{ua_y_box}" width="{ua_w_box}" height="{ua_h_box}" rx="3" fill="#E30613"/>
  {chr(10).join(ua_paths)}
  {chr(10).join(d_paths + c_paths)}
  {chr(10).join(brand_paths)}
</svg>
'''

# ---------------------------------------------------------------------------
# 3) AVATAR MARK — DC monogram (favicon, малі контексти)
# ---------------------------------------------------------------------------
def build_avatar_mark():
    W = H = 400
    cx, cy = W/2, H/2
    fs_dc = 220
    d_w = LETTERS["D"][1] * fs_dc / UPM
    c_w = LETTERS["C"][1] * fs_dc / UPM
    spacing = 16
    total = d_w + c_w + spacing
    d_x = cx - total/2
    c_x = d_x + d_w + spacing
    dc_y = cy + fs_dc*0.688/2

    d_paths, _ = text_paths("D", fs_dc, d_x, dc_y, "#FFFFFF")
    c_paths, _ = text_paths("C", fs_dc, c_x, dc_y, "#E30613")

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
  {chr(10).join(d_paths + c_paths)}
</svg>
'''

# ---------------------------------------------------------------------------
# 4) FAVICON — мала версія DC monogram
# ---------------------------------------------------------------------------
def build_favicon():
    W = H = 100
    cx, cy = 50, 50
    fs = 50
    d_w = LETTERS["D"][1] * fs / UPM
    c_w = LETTERS["C"][1] * fs / UPM
    spacing = 2
    total = d_w + c_w + spacing
    d_x = cx - total/2
    c_x = d_x + d_w + spacing
    dc_y = cy + fs*0.688/2

    d_paths, _ = text_paths("D", fs, d_x, dc_y, "#FFFFFF")
    c_paths, _ = text_paths("C", fs, c_x, dc_y, "#E30613")

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
  <circle cx="{cx}" cy="{cy}" r="49" fill="none" stroke="#E30613" stroke-width="2"/>
  <circle cx="{cx}" cy="{cy}" r="46" fill="#0A0A0A" stroke="#FFFFFF" stroke-width="3"/>
  {chr(10).join(d_paths + c_paths)}
</svg>
'''

# Build all
(LOGO / "dreamcar-racing-plate.svg").write_text(build_racing_plate(), encoding="utf-8")
print(f"✓ racing-plate.svg ({(LOGO / 'dreamcar-racing-plate.svg').stat().st_size} bytes)")

(LOGO / "dreamcar-avatar-circle.svg").write_text(build_avatar_circle(), encoding="utf-8")
print(f"✓ avatar-circle.svg ({(LOGO / 'dreamcar-avatar-circle.svg').stat().st_size} bytes)")

(LOGO / "dreamcar-avatar-mark.svg").write_text(build_avatar_mark(), encoding="utf-8")
print(f"✓ avatar-mark.svg ({(LOGO / 'dreamcar-avatar-mark.svg').stat().st_size} bytes)")

(ROOT / "favicon.svg").write_text(build_favicon(), encoding="utf-8")
print(f"✓ favicon.svg ({(ROOT / 'favicon.svg').stat().st_size} bytes)")

print("\nDONE — лого тепер з вбудованими paths, без залежності від шрифтів.")

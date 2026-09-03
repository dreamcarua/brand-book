# DreamCar Brand Book

Brand Book DreamCar v4 «Etalon» — the operating system of the DreamCar brand (Ukrainian car club, est. 2016; 19 cars handed over, 500K+ community). 30 self-contained sections in `sections/*.html` plus a landing, a generated print version and a PWA. Pure HTML/CSS/JS, no build step; `assets/sidebar.js` injects navigation, search and SEO meta at runtime; `.github/workflows/brand-lint.yml` runs `scripts/brand_lint.py` on every push and PR and blocks the merge on forbidden vocabulary and broken links.
Memory carrier: `github.com/dreamcarua/brand-book` (this repo), folder `memory/`. GitHub Pages serves this repo from the ROOT to `brand.dreamcar.ua`, so every file here is public — see Rules.
Project hub: `github.com/dreamcarua/dreamcar-memory` — project-level memory (launches, marketing, strategy, team, business decisions). `memory/` here is about this repo only.
Owner: Vadym (vg@abrisart.com, vg@dreamcar.ua for brand matters). Tasks are closed by whoever set them; we hand over.

## Rules

- Talk to the user in Ukrainian (or the language they write in). Dates DD.MM.YYYY, time CET/CEST.
- PUBLIC repo published from the root: anything committed is readable at `https://brand.dreamcar.ua/<path>`. Never commit secrets, tokens, hosts, IPs, chat ids, account names or personal data of participants.
- **Legal lexicon comes first.** In any DreamCar text — here, in email templates, in examples — never write «розіграш», «лотерея», «квиток», «білет», «шанс», «виграй», «джекпот», «казино», «азарт», «ставка», «фарт». Write «учасники», «токени ШІ-сервісу», «автомобіль вручається серед учасників», «власники» (not «переможці»). The canon lives in `sections/legal.html` (section 11B; `legal-safe-lexicon.html` is only a redirect stub) and is enforced mechanically by `scripts/brand_lint.py`.
- Rule hierarchy when two sections disagree: **LAW (11B) → VOICE (11) → VISUAL**. The legal lexicon overrides nothing else — nothing overrides it.
- Canonical CTA rhythm: «Бери. Дій. Володій.» The retired «Бери. Дій. Виграй.» is a lint BLOCK anywhere in the repo.
- Do on your own: section content, styles, scripts, generated artifacts, commits to `main` once `python3 scripts/brand_lint.py` passes.
- Always ask first: publishing a factual claim about the club (car count, community size, a named owner), anything with money or personal data, rotating a key, changing repository visibility.
- Never: hand-edit `print.html` or `assets/search-index.json` — they are generated and your edit is lost on the next build.
- Secrets never go into this repo. `memory/tooling.md` says where they live, not what they are.

## Entry — before the first action that changes project state

Chat without a folder? Nothing was loaded automatically: fetch this file and `memory/` from the carrier first.

1. `memory/tasks.md` — what is open, what is handed over and waiting, where the next move is ours.
2. `memory/handoff.md` — not empty means a previous session stopped mid-task. Continue, do not restart.
3. `memory/traps.md` — before the first edit of a section, an asset or a workflow. Always.
4. `memory/tooling.md` — before using any tool, MCP, workflow or account of this project.
5. Recent commits — this repo shares `assets/global-header.js` with other DreamCar systems; check nobody is mid-change there.
6. The task touches launches, participants, marketing, money or people rather than this book → fetch `AGENTS.md` and `tasks.md` from the project hub `dreamcarua/dreamcar-memory` too, before deciding anything.

Say one sentence: how many tasks are open, which are on us, what you start with. If a move is ours, say that first, even if asked about something else.

A task you were just given goes into `memory/tasks.md` now, verbatim, with the author name. Before starting it, check it is not already done in the sections.

## Context loss — when you can no longer quote the original task verbatim

You detect this yourself; nobody will tell you. Your context was compacted. Before the next action re-read `memory/handoff.md` and `memory/tasks.md`. Do not trust the summary for paths, numbers or what is already done; re-read the file.

## Checkpoint — during long tasks

Automatic. The user never asks for a checkpoint and is never reminded to.

After each completed step of a multi-step task and before any long operation: rewrite `memory/handoff.md` (task verbatim, done, not done, next action, numbers with sources). Rewrite, do not append. Empty it when the task is handed over.

## Pre-flight — before an irreversible action, money, or a shared resource

Answer out loud in the reply. No answer to a line = no action.

1. WHOSE. Who else changes this? `assets/global-header.js` and `assets/styles.css` are used by other DreamCar systems — is anyone editing them right now?
2. SOURCE. Number · source · date. Facts about the club (19 cars, 500K+, owner names) come from `sections/trust.html` and the hub, not from memory.
3. WHOLE. All 30 sections or the one you opened? A wording change is almost never local.
4. WORST. Which single check, if it came out differently, would cancel this? Usually: `python3 scripts/brand_lint.py`.
5. ROLLBACK. Exact command. Backup made and verified.

## Exit — automatic, before the word "done"

You run this unasked, every time a task changed project state — the user does not say "Exit" and does not remember these files exist. Also run it when the user says the task is finished, changes subject, or leaves; a task interrupted mid-way gets a Checkpoint instead.

1. What did I learn about this project? → `memory/traps.md`, `memory/tooling.md`
   Learned a business fact rather than a fact about this book (a launch, a partner, a decision of Vadym) → the project hub `dreamcarua/dreamcar-memory`, via the GitHub tool. One fact lives in one place.
2. What did I decide and why? → `memory/decisions.md`; a user-visible change also goes into `CHANGELOG.md`.
3. What is left open, including side findings nobody asked for? → `memory/tasks.md`
4. Can the owner see the result without effort? If not: screenshot, preview or link with the handover.
5. Report through the project channel → `memory/tooling.md` → Reporting.

Records go in the same commit as the change. Hand over now, in this reply. A line leaves `tasks.md` when its author confirms, not when the work is done.
Two people ask for opposite things: pick one, name the conflict, tell Vadym.

## Map

| File | What | Read when |
|---|---|---|
| `memory/tasks.md` | open tasks, handed-over-and-waiting | entry. Always |
| `memory/handoff.md` | mid-task state of the last session | entry; after context loss |
| `memory/traps.md` | traps of this project | before the first edit. Always |
| `memory/tooling.md` | Pages, DNS, brand-lint, generators, secrets names, entry patterns, reporting | before using any tool |
| `memory/decisions.md` | why it is this way | before changing something agreed |
| `memory/open-questions.md` | blocked until a human decides | before talking about plans |
| `memory/changelog.md` | changes made outside git | after any change outside git |
| `memory/archive/COWORK-INSTRUCTIONS.md.03.09.2026.md` | verbatim copy of the original deploy instructions | when redoing the Pages or DNS setup |
| `sections/legal.html` | 11B legal-safe lexicon — the canon the linter enforces | before writing any public text |
| `CHANGELOG.md` | user-visible version history | before claiming what version the site is |
| `AUDIT_BRAND_BOOK_2026-05-22.md`, `AUDIT_BRAND_BOOK_2026-05-25.md` | two audits; their unfinished items are in `memory/tasks.md` | when planning the next iteration |
| `github.com/dreamcarua/dreamcar-memory` (hub) | launches, marketing, strategy, team | when the task goes beyond this book |

## Related carriers — the same project, other repositories

| Carrier | What it is | Read its `AGENTS.md` + `tasks.md` when |
|---|---|---|
| `github.com/dreamcarua/dreamcar-memory` | project hub: launches, marketing, strategy, team, business decisions | the task is about the business, not about this book |
| `github.com/dreamcarua/dreamcar-dashboard` | internal analytics, `dashboard.dreamcar.ua`, ETL into Supabase HQ | numbers, metrics or anything the book quotes as a fact |

A task that spans two carriers: one line in each `tasks.md`, each pointing at the other.

## Overrides of global rules

| Global rule | Here | Why | Since |
|---|---|---|---|
| "write plainly what happened" | the legal lexicon wins over plain speech: never «розіграш»/«квиток»/«шанс», always «учасники», «токени ШІ-сервісу», «автомобіль вручається серед учасників» | Ukrainian law on lotteries; the wording is a legal position, not a style preference | 03.09.2026 |
| "commit straight to `main` in `dreamcarua/*`" | only after `python3 scripts/brand_lint.py` passes locally | CI blocks the push anyway, and a red badge sits in the README | 03.09.2026 |

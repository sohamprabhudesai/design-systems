# Neeto Design System V2 (Atoms)

The current neeto design system, distilled from **neeto-atoms 1.1.1** (`@bigbinary/neeto-atoms`, shadcn/Base UI
+ Tailwind v4) and **neeto-molecules 5.9.9 `v2/`** (`@bigbinary/neeto-molecules/v2/<Name>`). Every neeto web
product is now on this stack (desk, crm, chat, form, invoice, kb, planner, pay, auth and, since PR #27053, cal).
The V1 system (NeetoUI v8 + molecules v1, Inter) is kept in this repo for reference only; do not mix the two.

## What changed from V1 → V2

| | V1 (NeetoUI) | V2 (neeto-atoms 1.1.1) |
|---|---|---|
| Font | Inter | **Geist Variable** |
| Primary | Green #008068 (fixed RGB) | **Brand green** `--brand` oklch(0.5349 0.1023 173.46) ≈ #008068; black survives as `--neutral-solid` |
| Tokens | Fixed RGB palette | **Semantic OKLCH tokens**, automatic dark mode (`.dark`, `.light` islands) |
| Radius | 5px controls | 6 menu rows/chips · 8 sm buttons, pickers · **10 buttons/inputs** · 14 cards/dialogs · pill |
| Surfaces | 1px border + shadow | **1px `ring-foreground/10`** on dialogs, cards, menus, popovers |
| Statuses | Outlined Tags | **Badges**: 8 colours × solid/subtle, 6px indicator dot |
| Toasts | Solid Toastr | Solid **Toastr** (status `-solid` tokens), bottom-left, errors never auto-dismiss |
| Table header | 13px uppercase gray | **44px on `--muted`, 14px/500 foreground** |
| Sidebar | 64px icon rail | **240px flat labeled nav**, white active chip with brand text, profile in a floating tab |
| Page title | 24px | **32px/600** (Header), 24px for `size="nano"` |

## Non-negotiable rules

1. **Tokens only**: never hex. Surfaces `background/card/popover/muted/accent/secondary`; text `foreground`,
   `muted-foreground`, `placeholder`, `link`, `brand-text`; lines `border/input/ring`; `primary` (= brand),
   `neutral-solid`, `destructive`; 5-token status sets `success|error|warning|info` (+ `-foreground/-border/-solid/-solid-foreground`);
   `sidebar-*`; `row-selected`; `chart-1…5`; avatar `--avatar-l/c/fg`.
2. **Brand green is the primary action colour.** One filled `default` (green) CTA per view. Use `neutral` (black,
   inverts in dark) for emphasis that should not read as brand, `outline`/`ghost` for secondary, `link` (blue
   `--link`, underline on hover) for navigation. Checked controls, progress, selected dates and stepper are green.
3. **Geist, 14px/400/20px default.** Weights 400 body · 500 buttons/labels/active · 600 headings. Typography
   variants jumbo 48 … h2 32 · h4 24 · h6 16 · body1 16 · body2 15 · **body3 14 (default)** · caption 12.
4. **Heights**: buttons 24/28/32/36 · inputs 28/32/40 · menu rows 36 (compact 28) · table header 44 ·
   sidebar items 36 · navigation header 64.
5. **Focus** = `border-ring` + 3px `ring/50` halo (destructive `/40`, neutral `/40`). Invalid = destructive border +
   3px `/20`. Disabled = 50% opacity.
6. **Overlays**: Dialog/Alert 384/**512**/768, radius 14, 24px title, muted/50 footer band right-aligned; Sheet
   384/512/672 with left-aligned muted footer; overlay `black/50`, no blur.
7. **Layout (molecules v2)**: Container 40px side padding (20 mobile) · Header 40 top/24 bottom with Search
   (202px) + actions right · SubHeader count text (16px/600) left, ghost icon RightBlock right, 20px below ·
   DataTable. Forms in CardLayout (768px card, sticky muted footer). Settings landing = grid of link cards.
8. **Dark mode is mandatory** in admin UIs; tokens handle it. Dark elevates with lighter surfaces, not shadows.
9. **Destructive flows**: Alert (`style="danger"`: outline Cancel + destructive) or ConfirmationModal (typed);
   `destructive-soft` for secondary destructive buttons.
10. **Selection**: checked controls `primary`; selected rows `row-selected`; sidebar active = `sidebar-primary`
    chip + `sidebar-primary-foreground` (brand-text); sub-item active = brand-text, no background.

## Files

- `src2/foundations/`: colour tokens (light + dark), typography/radius/focus/elevation.
- `src2/components/`: buttons, badges, forms & selection, callouts & toasts, dialogs/sheet/menus,
  table/tabs/cards, feedback & identity (avatar, stepper, progress, empty…), date & time.
- `src2/patterns/`: App Shell v2 light and dark, layout molecules, the 83-molecule v2 catalog.
- `src2/patterns/neetocal-*.html`: **neetoCal fit check** (see below).
- `tokens-v2/tokens.css`: the `:root,.light` and `.dark` blocks copied verbatim from neeto-atoms `src/index.css`
  (plus the radius scale and font). `tokens-v2/tokens.json`: the same, structured.
- `build/atoms.css`: hand-built component CSS mirroring the atoms cva strings and molecules v2 layouts.

## neetoCal fit check

neetoCal (`origin/main` e67112d8fb) was rebuilt in the system on two pages:

- **Admin fits.** Sidebar, list pages, forms, settings, integrations and the meeting builder are all stock atoms +
  molecules v2 on default tokens (no brand/radius/font overrides).
- **Gaps the system does not cover yet** (neetoCal hand-builds them):
  - colour swatch/dot for user-data hexes;
  - an availability-aware calendar (day circles with available/selected/today-dot states) and FullCalendar event-chip
    styling, plus a multi-date `Calendar` mode;
  - slot button + slot list;
  - Timeline;
  - NumberInput stepper;
  - an inline-link Button variant (replacing 28× `!inline !h-auto !p-0`).
- **Booking-page theming**: neetoCal maps 8 neetothemes RGB triplets onto ~18 atoms tokens. It works for every
  stock component, but it sets `--primary` rather than `--brand`. It derives only the `info` status palette from
  the theme, so warning/success/error stay light-mode pastels on dark-card themes. The system should own this
  "theme scope" contract.

## Regenerating

`node build/build2.mjs` builds `src2/` → `ds2/`, inlining the Geist woff2, `tokens-v2/tokens.css`, `build/atoms.css` and
`build/sheet2.css`. To update for a new atoms release:

1. Regenerate the tokens: `python3 build/gen_tokens.py <neeto-atoms checkout> tokens-v2/tokens.css tokens-v2/tokens.json`.
2. Diff the cva / className strings in `src/components`, `src/primitives` and `src/shadcn/components`.
3. Update `build/atoms.css` and rebuild.

For molecules, read the v2 sources recovered from `dist/v2/*.js.map`.

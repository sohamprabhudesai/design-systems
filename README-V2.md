# Neeto Design System V2 (Atoms)

The **next-generation** neeto design system, distilled from **neeto-atoms** (`@bigbinary/neeto-atoms`,
neeto-atoms.neeto.com — shadcn/Radix + Tailwind v4) and **neeto-molecules v2** (`@bigbinary/neeto-molecules`
`v2/` namespace). Use this for new neeto product designs on the atoms stack. The V1 system (NeetoUI classic,
green-primary, Inter) lives in a separate project — do not mix the two.

## What changed from V1 → V2

| | V1 (NeetoUI) | V2 (neeto-atoms) |
|---|---|---|
| Font | Inter | **Geist Variable** |
| Primary | Green #008068 | **Near-black** `oklch(0.205 0 0)` (inverts in dark) |
| Tokens | Fixed RGB palette | **Semantic OKLCH tokens**, automatic dark mode |
| Radius | 5px controls | **10px** controls (6/8/10/14 scale) |
| Statuses | Outlined Tags | **Subtle Badges** (color-50 bg / color-700 text) |
| Toasts | Solid colored Toastr | **Sonner** light cards with status icon |
| Table header | 13px uppercase gray | 14px **500-weight muted, no uppercase** |
| Sidebar | 64px icon rail | **256px labeled nav** on sidebar tokens |
| Motion | 300ms linear | ~150ms ease, `active:translate-y-px` press |

## Non-negotiable rules

1. **Tokens only** — never hex. `background/foreground`, `primary`, `secondary`, `muted(-foreground)`,
   `accent`, `destructive`, `border`, `input`, `ring`, `card`, `popover`, `sidebar-*`, `row-selected`,
   and 5-token status sets (`success|error|warning|info` + `-border/-foreground/-solid/-solid-foreground`).
2. **Monochrome first**: the only filled CTA is near-black `primary`. Color appears via subtle badges,
   status callouts and destructive actions — never as decorative fills.
3. **Geist, 14px/400/1.45 default.** Weights: 400 body · 500 buttons/labels/active · 600 headings
   (−0.02em ≥20px). One text-2xl page title per screen.
4. **Radii**: 6 menu items · 8 sm buttons/popovers · 10 buttons/inputs/dialogs · 14 cards · full pills.
5. **Heights**: buttons 24/28/32/36 · inputs 32 · table header 40 · nav header 64.
6. **Focus** = `border-ring` + 3px `ring/50` halo (destructive: `destructive/40`). Disabled = 50% opacity.
7. **Borders over shadows**: shadow-sm cards, shadow-md popovers, shadow-lg dialogs. Dark mode elevates
   with lighter surfaces (`card`/`popover` = oklch 0.205), not shadows.
8. **Dark mode is mandatory** — every screen must work in both; if a design uses tokens correctly it's automatic.
9. Destructive flows: AlertDialog (or molecules ConfirmationModal) with `destructive` button; prefer
   Sonner "Undo" for reversible actions. `destructive-soft` for secondary destructive buttons.
10. Selection: checked controls are `primary`; selected rows use `row-selected`; sidebar active uses `sidebar-accent`.

## Component inventory

**neeto-atoms Components**: Accordion, Avatar, Badge, Button, Callout, Checkbox, ColorPicker, DataTable,
DatePicker, DropdownMenu, Empty, Input, Kbd, Label, MultiEmailInput, Pagination, Progress, RadioGroup,
Select, Slider, Spinner, Stepper, Switch, Tabs, Textarea, TimePicker, Tree, TreeSelect + Overlays
(Alert, Dialog, Popover, Sheet, Sonner, Tooltip) + Formik bindings.

**Primitives** (full shadcn set): AlertDialog, AspectRatio, Breadcrumb, ButtonGroup, Calendar, Card,
Carousel, Chart, Collapsible, Combobox, Command, ContextMenu, Drawer, Field, HoverCard, InputGroup,
InputOTP, Item, Menubar, NativeSelect, NavigationMenu, Resizable, ScrollArea, Separator, Sidebar,
Skeleton, Toggle, ToggleGroup, and more.

**Key specs** (extracted from the package's cva definitions):
- Button: variants default/outline/secondary/ghost/destructive/destructive-soft/link; sizes xs 24 · sm 28 · default 32 · lg 36 (+ icon squares); 14px/500.
- Badge: 20px pill 12px/500; variants default/secondary/destructive/outline/ghost/link + colors gray/blue/purple/amber/red/pink/green/teal (each with `-subtle`); sizes sm 16/lg 24; shape pill|rounded.
- Input: h-32, radius 10, border `--input`, transparent bg; focus ring recipe; aria-invalid destructive ring.
- Tabs: pill list h-32 on muted with 3px padding (active = background card + shadow-sm), or `line` variant.
- Switch: 24×14 / 32×18.4 / 44×24; checked = primary.
- Callout: soft status bg + border + foreground, 16px icon, semibold title.

**neeto-molecules v2**: see the Patterns → Catalog card (Layouts: Container/Sidebar/Header/SubHeader/
NavigationHeader/Scrollable; ~75 patterns incl. ConfirmationModal, StatusDropdown, Search ⌘K, FileUpload,
BoardView, Insights, LoginPage, Onboarding, Settings).

## Files

- `foundations/` — color tokens (light+dark), typography/radius/focus.
- `components/` — buttons, badges, forms & selection, callouts & toasts, dialogs/sheet/menus, table/tabs/cards.
- `patterns/` — App Shell v2 in light **and dark**, molecules v2 catalog.
- `tokens/tokens.css` — the exact `:root` + `.dark` token blocks from `@bigbinary/neeto-atoms` `dist/index.css`.
- `tokens/tokens.json` — same, structured.

## Regenerating

Local source `~/dev/neeto-design-system`: `src2/` pages + `build/build2.mjs` (`node build/build2.mjs` →
`ds2/`; inlines `build/atoms.css` + embedded Geist from `build/geist-latin.woff2`). To update: `npm pack
@bigbinary/neeto-atoms`, diff `dist/index.css` tokens and the cva strings in `dist/*.js`, update
`build/atoms.css`, rebuild, re-sync.

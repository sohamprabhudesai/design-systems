# Neeto Design System

A Claude Design system distilled from **NeetoUI v8** (`@bigbinary/neetoui`, neeto-ui.neeto.com) and
**neeto-molecules** (neeto-molecules.neeto.com) — the component libraries behind all neeto products
(neetoDesk, neetoChat, neetoCal, neetoForm, …). Use it to design new neeto product screens that look
and feel native to the suite.

## How to use this project

- **Foundations** — colors, typography, radius/elevation/layout: the raw ingredients.
- **Components** — pixel-faithful previews rendered with the *actual compiled NeetoUI CSS* and real
  class names (`neeto-ui-btn`, `neeto-ui-input`, …). Match these exactly.
- **Patterns** — the app shell every neeto product uses, plus the catalog of higher-level
  neeto-molecules to reach for before inventing anything new.
- **tokens/tokens.css** — copy-paste CSS variables for any new design.

## Non-negotiable rules

1. **Font**: Inter (fallback system stack). Body is 14px / 400 / 1.3, `gray-800` (#101828).
2. **Color roles**: green `primary-500` (#008068) is *only* for primary actions, checked controls,
   focus rings and selection tints. Blue `accent-800` for links. Red/amber/blue semantic tints use the
   100-shade for backgrounds and 800-shade for text.
3. **One primary button per view.** Pair it with text/tertiary buttons ("Cancel" is `style="text"`).
4. **Radii**: 5px controls · 6px callouts · 8px cards · 12px modals · full for tags/avatars/pills.
5. **Spacing**: 4px grid. Common gaps: 8px (within a control group), 12–16px (between fields),
   24px (page padding, modal padding), 20px under the sub-header.
6. **Heights**: buttons 28/32/40 · inputs 26/30/38 · table header 40 · app header 80 · sub-header 37.
7. **Focus**: 3px `rgba(primary-500, 50%)` outline (buttons/controls) or primary border +
   3px 15% halo (inputs). Never remove focus states.
8. **Elevation**: dropdowns/popovers `shadow-lg`; sticky footers `shadow-md`; cards `shadow-xs` or a
   1px `gray-200` border (never both heavy).
9. **Overlays**: modal widths 320/480/720; pane widths 480/50vw; backdrop `#1b1f23dd` + 2px blur.
10. **Empty states** use NoData (illustration → h4 title → body2 gray-600 description → actions);
    destructive flows confirm via Alert/ConfirmationModal with a danger button.

## Component quick reference (NeetoUI)

| Component | Variants / props |
|---|---|
| Button | style: primary · secondary · tertiary · text · link · danger · danger-text; size: small 28 · medium 32 · large 40; icon left/right, loading, fullWidth |
| Input / Textarea | sizes small/medium/large; label, help/error/warning text, maxLength counter, prefix/suffix (inline or block add-on), naked, disabled |
| Select | react-select single/multi; multi values render as removable solid gray tags |
| Checkbox / Radio / Switch | checked = primary-500; radio horizontal or stacked; switch 44×24 with check-in-knob |
| Tag | type outline/solid × styles primary/secondary/success/warning/danger/info; sizes small/large; indicator dot; onClose |
| Avatar | 24/32/40/64; circle; initials on pastel bg; status online/idle/offline |
| Callout | info · warning · danger · success (100-tint bg, 500 icon) |
| Toastr | success/error/warning/info; solid 600 bg; bottom-left; optional action |
| Modal / Alert / Pane | modal 320/480/720 radius 12; alert = destructive confirm; pane 480/50vw right drawer w/ 78px header + 80px shadow footer |
| Dropdown | 32px items, hover gray-200, danger item error-800, dividers |
| Tooltip / Popover | dark 12px bubble / light card with title + copy + link |
| Table | 40px gray-50 header (13px semibold uppercase gray-600), row hover gray-50, selection primary-50, kebab actions, pagination bottom-right |
| Tab | underline style; 14px semibold; active gray-800 + 2px bar |
| Accordion | 16px medium handles, gray-300 dividers |
| Stepper | done success-500 ✓ · active accent-500 · upcoming gray-200 |
| Pagination | 28px items, active solid primary-500 |
| Spinner / ProgressBar / NoData / Kbd / Label | as per Feedback & Tags previews |

Also available in NeetoUI: ActionDropdown, ColorPicker, DatePicker, TimePicker, MultiEmailInput,
Slider, Tree, TreeSelect, ProgressBar, and Formik-bound form components.

## neeto-molecules (use before inventing)

Layouts (Container, Header, SubHeader, Scrollable, Sidebar, MenuBar) plus ~80 patterns:
ConfirmationModal, DeleteArchiveModal, FinderModal, StatusDropdown, Search (⌘K), FileUpload,
EmailForm, DocumentEditor, Codeblock, InlineInput/Rename, EmojiPicker, IconPicker, DateRangeFilter,
BoardView, CalendarView, DndTable, AuditLogs, VersionHistory, Insights, LoginPage, ErrorPage,
PageLoader, Onboarding, IntegrationCard, ToggleFeatureCard, KeyboardShortcuts, CopyToClipboardButton,
ShareViaLink/Email, StickyRibbonsContainer, and more — see the Patterns → Catalog card.

## Regenerating this bundle

Local source: `~/dev/neeto-design-system` — `src/` pages + `build/purge.mjs`
(`node build/purge.mjs` rebuilds `ds/` with freshly purged CSS from `build/neetoui.css`).
To update for a new NeetoUI release: download the new `dist/index.css` from unpkg into
`build/neetoui.css`, diff `src/styles/abstracts/_variables.scss` in github.com/bigbinary/neeto-ui,
rebuild, and re-sync.

# Sleepwell Virtual Salesman — mobile screens

Mobile screens implemented from Figma `Sleepwell Virtual Salesman App UI`
(file key `ccT41qrQ7vVlmUPAgBr2Od`):

| Screen | File | Figma node |
| --- | --- | --- |
| Personal Corner | `index.html` | `7005:4811` |
| Store setup | `digital-sales-tool.html` | `1787:15156` ("Onboarding 1") |
| Select bed displays | `bed-displays.html` | `1787:15272` ("Onboarding 2") |
| Sort menu (on bed displays) | `bed-displays.html` | `2272:13193` ("sorting mobile") |
| Store setup complete | `store-setup-complete.html` | `1801:12934` ("Onboarding 3") |
| Select store favourites | `store-favourites.html` | `1864:12488` ("Onboarding 4") |
| Snackbar (on store favourites) | `store-favourites.html` | `1880:14885` ("Snackbars / Single Line") |
| Settings | `settings.html` | `1883:15912` ("Settings") |
| Snackbar (on settings) | `settings.html` | `2254:13162` ("Snackbars / Single Line") |
| Welcome | `welcome.html` | `1733:17297` ("Welcome Screen") |
| Search from leads | `leads.html` | `5704:18650` ("Lead Name") |
| Filter (on leads) | `leads.html` | `5705:18869` ("sorting mobile") |
| Lead details | `lead-details.html` | `5710:18704` ("Lead Details") |
| Reference mattress selection | `reference-mattresses.html` | `1740:11572` |
| Select mattresses | `select-mattresses.html` | `1733:12994` |
| Filter (on select mattresses) | `select-mattresses.html` | `2272:13181` ("sorting mobile") |
| Mattress detail | `mattress.html` | `1711:11278` ("Mattress 1") |
| Condensed header (on mattress) | `mattress.html` | `1883:15347` ("Mattress Sticky / Small") |
| Layer breakup slides 2-3 | `mattress.html` | `1883:15475`, `1883:15671` |
| Full-size gallery | `mattress.html` | `1883:15068` |
| Pillow card | `mattress.html` | `1787:14724` |
| Breadcrumbs | `assets/js/breadcrumbs.js` | `1733:17258` |

Flow: Personal Corner → **Digital Sales Tool** tile → store setup → **Bed
displays** → pick mattresses → **Confirm** → store setup complete ("Modify
selection") → **Store favourites** → pick → **Confirm** → back to store setup
complete. Each screen's Sleepwell logo returns to Personal Corner.

Both endings lead to **Welcome**: **Done** on store setup complete goes
straight there, and **Save** on Settings raises its snackbar first, then
follows after 1.2s — long enough to read the confirmation, since navigating
immediately would show it for a single frame.

From Welcome, **Search Leads** opens the lead list; tapping any lead — or
**View Details** — opens that lead's details. The back arrows step back one
screen, and **Back to Home** on lead details returns to Welcome, which is
home for this flow.

The gear on the store-favourites, welcome and leads headers opens
**Settings**, whose Edit cards go to the same pickers.

Two pairs of screens are one Figma component each, so each pair shares its
CSS and differs only in content:

- `store-favourites.html` ← `bed-displays.html` — differs by title, the "out
  of 4" total, the header gear, and where its buttons return to.
- `settings.html` ← `store-setup-complete.html` — differs by title ("Settings"
  rather than the dealer name) and by "Save" rather than "Done". Settings has
  no gear of its own, since that is what opened it.

Every screen is **stateless** — each is a faithful, static rendering of its
Figma frame, and nothing is remembered between them. The counts on store
setup complete (10 / 8 / 11 / 4) are the design's own numbers, so they do not
reflect what was actually ticked on the way through. Wire them to real state
when there is an API behind this.

## Run

```bash
python3 server.py
```

Then open http://127.0.0.1:4321/mockup.html (or `/index.html` for the bare
screen). Opening `index.html` from disk mostly works, but some browsers
refuse the relative font and asset paths over `file://`, so the server is the
reliable route.

### Port 4321 is reserved

**Port 4321 belongs to this server. Leave it running, and do not give the
port to any other service.** `.claude/launch.json` pins it with
`"autoPort": false` so nothing reassigns it. If a start fails with "port in
use", the existing server is almost certainly still serving — check it with
`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:4321/index.html`
and reuse it rather than killing the process.

`server.py` reads `$PORT` if you need a second instance elsewhere
(`PORT=4399 python3 server.py`), which leaves 4321 untouched.

### macOS note

`preview_start` cannot manage this server: `~/Documents` is TCC-protected and
the preview harness's spawned processes get `PermissionError` reading it, so
the server has to be started from a shell that does have access. Granting the
app Documents access, or moving the project outside `~/Documents`, would lift
that restriction.

## Hosting on GitHub Pages

The whole app is static — every path is relative, nothing calls back to
`server.py` — so it needs no build step and no server-side code to host.

Pages is set up via **Settings → Pages → Build and deployment → Source:
GitHub Actions**, which committed `.github/workflows/static.yml` (GitHub's
own starter workflow): every push to `main` uploads the whole repo as-is
and deploys it, no build step. The site publishes at
`https://bhumika922.github.io/sleepwell-prototype/` — a subpath, not the
domain root, which is exactly why every href, src and CSS `url()` in this
repo is relative rather than rooted at `/`; a rooted path would 404 there.

`.nojekyll` is committed at the repo root too. The Actions workflow doesn't
run Jekyll in the first place, so it's a no-op under this setup — it only
matters if Pages is ever switched to the older "deploy from a branch"
source, where it stops GitHub from running the files through Jekyll first.

`server.py` and the `.claude/` preview config remain for local development
only — Pages ignores both and serves the HTML/CSS/JS/assets directly.

## Files

```
index.html                Personal Corner
digital-sales-tool.html   Store setup
bed-displays.html         Select bed displays (mattress picker)
store-setup-complete.html Store setup complete + recommendations
store-favourites.html     Select store favourites (same picker)
settings.html             Settings (same shell as store setup complete)
welcome.html              Welcome — mattress size picker
leads.html                Search from leads
lead-details.html         Lead details + recommended mattresses
reference-mattresses.html Store favourites, buzzwords, area recommendations
select-mattresses.html    Full catalogue banded by softness
mattress.html             Mattress detail — layers, thickness, gallery, pillows
mockup.html               presentation shell: the screens in an iPhone frame
styles.css                every screen; Figma styles are CSS custom properties
                          in :root, and each screen's rules are namespaced
                          (`setup-*`, `bd-*`, `rec-*`, `ld-*`, `welcome-*`)
                          so they cannot collide
assets/js/               breadcrumbs overlay, shared by every screen with a
                         back button
assets/icons/            UI icons exported from Figma as SVG
assets/img/              artwork and brand imagery exported as PNG/SVG
assets/fonts/            Intelo webfonts, all 16 styles (see its README)
server.py                static file server for local dev (see Run, above)
.claude/                 preview launch config for local dev tooling
.github/workflows/      GitHub's starter workflow, deploys main to Pages
.nojekyll                belt-and-suspenders — see Hosting on GitHub Pages
.gitignore               OS/editor/Python cruft (.DS_Store, __pycache__, …)
```

## Presentation mockup

`mockup.html` frames the real page in an iPhone body — Dynamic Island, status
bar, home indicator, titanium rail. It embeds `index.html` in an iframe, so
it is the live screen rather than a screenshot: it scrolls and taps.

The device is an iPhone 16 Pro (393 x 852 pt), scaled down to fit the window
but never past 1:1.

`env(safe-area-inset-*)` always reports 0 inside an iframe, so the shell sets
`--safe-top` / `--safe-bottom` on the embedded document to whatever the
simulated device would report. That is the only reason those two custom
properties exist — the app itself should never set them by hand.

It is a presentation layer, nothing more: no app code depends on it, and
deleting it leaves `index.html` untouched.

## Layout notes

Every frame is 360 wide. Each design includes a 32px Android status bar that
these pages do not draw — the mockup's iOS status bar and `--safe-top` cover
it — so every y-position here is the frame's minus 32.

Personal Corner uses 14px side gutters and a 332px content column with a 3-up
tile grid (104px tiles, 10px column gap, 12px row gap); the later screens use
12px gutters and a 336px column. Pages are fluid rather than pinned to 360px:

- tile columns are `1fr` so the grid tracks the real viewport width
- the frame caps at 480px and centres on wider screens
- below 360px the gutter tightens and label tracking eases, so labels wrap at
  spaces instead of splitting words
- the bottom bar is fixed, with `env(safe-area-inset-*)` respected top and bottom
- the header is pinned on every screen: `.bd-sticky` covers the header plus
  the search and count rows on the picker screens, `.sticky-top` the header
  alone elsewhere. Both share one rule, and neither clips — a dropdown opened
  from inside has to be able to escape
- `--bar-clear` reserves the fixed bar's height, the home-indicator inset and
  16px, so the last card never sits flush against the bar

Verified at 320, 360 and 390px.

## Design tokens

Taken from the Figma styles on this node:

| Token | Value | Used for |
| --- | --- | --- |
| `--dark` | `#062B4E` | text, bottom nav background |
| `--bg` | `#ECF5FD` | bottom bar backing |
| `--grey-1` | `#F5F5F5` | page background |
| `--yellow` | `#FAB90E` | tile accent |
| `--orange` | `#FF6600` | tile accent |
| `--red` | `#DA281C` | tile accent |
| `--purple` | `#8C4699` | tile accent |
| `--blue-light` | `#89AEDE` | tile accent |
| `--blue` | `#407DC9` | selected states, links, "Setup now" |
| `--disabled` | `#BDBDBD` | inactive primary button |
| `--cool-grey` | `#C1D1E0` | hairline rules, input borders |
| `--card-bg` | `#DCECFA` | unselected mattress-size pill |
| `--grey-3` | `#828282` | muted measurements, field labels |
| `--text-muted` | `#607D97` | lead phone numbers and timestamps |
| `--green` | `#27C637` | "Sold" status |

The 5px rule at the bottom of each Personal Corner tile cycles yellow →
orange → red → purple → light blue, matching the design.

## Known gaps

- **Intelo** is installed — all 16 styles, declared as one family with a
  100–800 weight ramp. See [assets/fonts/README.md](assets/fonts/README.md)
  for the ramp and why the vendor's own `stylesheet.css` isn't used. Confirm
  the webfont licence before deploying publicly.
- Tile artwork was exported from Figma as raster screenshots, so a few carry a
  faint off-white backing from the source capture — this is present in the
  Figma render too. Swapping in clean SVG icons would remove it.
- Tiles and nav buttons are inert (`href="#"`) apart from the Digital Sales
  Tool tile; wire the rest up when routing exists.
- **The two screens name different dealers** — Personal Corner says "Gupta
  Furnishers", store setup says "Tiwari & Sons". Both are verbatim from their
  Figma nodes, so tapping through changes who you are. It is placeholder copy
  in the design rather than an implementation bug, but it needs one real value
  once this is wired to data.
- The store-setup **Done** button is grey `#BDBDBD` and `disabled`, exactly as
  node `1787:15156` draws it. Progress runs through a setup card, not through
  Done, so it is deliberately a dead end. The navy, live Done belongs to store
  setup complete (node `1801:12934`).
- All four counts on store setup complete are the design's placeholder numbers
  — none of the pickers except bed displays exists yet. "Standing Displays" is
  also capitalised differently there than on store setup; both verbatim from
  their nodes.
- The four recommendation cards are static and all carry the bestseller star.
  Nothing in the design says how that list is chosen.
- Nothing on the store-setup screen navigates back in the design, so the
  header logo was made a link to Personal Corner. That is an addition, not
  something the Figma node specifies — remove it if the real flow differs.
- On bed displays, the cards **toggle** and the "Selected N out of 42" counter
  updates. The design ships both card states and a live counter, so this reads
  as intended, but it is behaviour rather than layout — see the `<script>` at
  the foot of `bed-displays.html` to remove it. The 42 is the design's
  catalogue total; only 16 mattresses are in the frame, so replace it with the
  real count when this is wired to data.
- **Deliberate deviation:** the Figma frame opens with four mattresses already
  selected and reads "Selected 4 out of 42". Per request, nothing is selected
  by default and the counter starts at 0 — the selected state is reachable by
  tapping. The design's four are Latex Plus, Eminence, Revital 4.0 and Esteem
  if that starting state is ever wanted back.
- **Deliberate addition:** the header, title, search and count/sort bar are
  pinned (`.bd-sticky`) so only the mattress list scrolls. The Figma frame is
  a single static artboard and says nothing about scroll behaviour.
- "Diginity" is spelled that way in the Figma node. Kept verbatim; it looks
  like a typo for "Dignity".
- The sort menu opens from **Price: Hi-Low**, and choosing an option relabels
  the trigger and actually reorders the grid. Only the panel itself is in the
  design; opening, choosing and reordering are behaviour, in the second
  `<script>` of `bed-displays.html`. "Bestsellers" has no field to sort on, so
  it restores the authored order — swap it for a real popularity rank later.
- The Figma sort panel paints the cool-grey block behind one row without
  saying whether that is hover or the current choice. It serves as **both**
  here. Note the design highlights "Bestsellers" while the trigger on the
  parent screen reads "Price: Hi-Low", so the two frames disagree about what
  is selected; the implementation follows the trigger.
- **Bed displays** and **Store favourites** link onward, from all three
  screens that list them. Standing Displays, Cut out samples and the search
  fields are inert.
- On welcome, the size pills pick (Queen is the design's default) but nothing
  reads the choice, and the custom Length/Breadth inputs are unwired.
- **Four buzzword chips carry inline widths** (Dual Comfort 115, Resitec/HR
  Foam 143, Gen X 69, Revital 68). The designer narrowed those below their
  natural padding so the list packs into five rows; the other nine measure
  within 1px of the frame on their own. Without the overrides it wraps to six
  rows and the section below drops 60px. Real chips will not come
  pre-measured — if these become data-driven, expect the wrap to differ and
  drop the inline widths rather than trying to preserve them.
- The buzzword chips are inert — no node for what follows. **See All
  Mattresses** opens the full catalogue, and every mattress card on that
  screen opens `mattress.html`, so the detail shown is always Spinetech Air's
  — the frame only specifies one.
- **Overlays.** Tapping a gallery image opens it full size with pinch-to-zoom
  (two-pointer pinch, drag to pan when zoomed, double-tap for 1x/2x, and wheel
  zoom so the gesture is also reachable on a trackpad); the first pillow opens
  its card. Long-pressing the back button on any screen opens the breadcrumbs.
- The breadcrumbs overlay is injected by `assets/js/breadcrumbs.js` rather
  than pasted into seven pages, so there is one copy to change. Its trail is
  **static** — the design's own four entries — because the screens hold no
  history to read. Wire it to a router later.
- Long press is 450ms and cancels on 10px of movement, so scrolling never
  triggers it; it also suppresses the click that would otherwise follow the
  back link, and the OS text-selection menu.
- Only the **first** pillow opens a card, and only one pillow card node
  exists; the other three are inert.
- Mattress detail is the one screen with **no Sleepwell header**: its pinned
  block is the mattress name, price and comfort row. The frame positions that
  block and the sections below it independently, leaving a 24px gap between
  them rather than stacking them.
- Its pinned block has two sizes: full at the top, and a 61px condensed state
  once the page scrolls — name at 18/24 with just softness and price, the
  blurb, tags and comfort row hidden. The on/off thresholds are offset (24 /
  8) so it cannot oscillate on a scroll that lands on the boundary.
- Its comfort row and the **Demo** checkbox each flip, since the frame ships
  two states for both.
- Layer breakup is a three-slide carousel — Top / Comfort / Support layers —
  sharing one pagination row; the dots track scrolling and also jump to a
  slide. Slides 2 and 3 use a second cut of the stack photo.
- **Three numbers on this screen came from measuring the rendered frame, not
  the code export.** The strip's pins sit at left 12 (the export said 36); its
  photo holds full contrast to ~72% of the width and only fades to white by
  ~83% (the export's "to-1/2" — and a first fix of mine that faded from 0 —
  wash the photo out across its whole width); and the export passes a
  `className` that discards the frame's own width, height and gradient. That
  component's generated code cannot be trusted; measure the render.
- **The carousel is 12px taller than the frame's slide 1.** All three slides
  share the tallest height (266 vs 254) so the page does not reflow when you
  swipe, which pushes the three sections below down 13px. The alternative —
  natural per-slide heights — matches the frame exactly at rest but jumps on
  every swipe. Thickness variants, the gallery and the pillows are
  static, and **Close sale** is inert.
- Select mattresses is a matrix that scrolls sideways past a softness rail
  pinned to the left edge, its four bands aligned to the four rows. Three
  cards (Mable, Eminence, Ultima) use the frame's unavailable styling — muted
  text on a grey card with an inset ring rather than a border, so they stay
  96px and their badges stay flush.
- Its filter sorts **within each softness band**, never across them: a card
  cannot leave its row without breaking the rail alignment. "Bestsellers"
  puts starred cards first within each row — unlike the bed-displays menu,
  which restores the authored order because those cards carry no star data.
  The authored order already is price-ascending, matching the default label.
- The two bottom-bar toggles flip but filter nothing, and the cards do not
  select — the frame shows only one state for each.
- The toggle is drawn in CSS rather than imported: the frame's asset is a flat
  rect plus a circle, and a real control can animate between states.
- On leads, every card links to the same `lead-details.html`, so the details
  shown are always Ninarika Rawal's — the frame only specifies one. The fourth
  card keeps the frame's selected styling as a static "current lead" marker;
  it no longer single-selects, since tapping now navigates.
- "Showing 32 leads" is the design's number against 9 listed, like the
  pickers' totals. **Last visited** sorts by name A–Z / Z–A; "Last Visited"
  itself restores the authored order, having no timestamp to sort on — every
  row carries the same date.
- Lead details is read-only: the mattress cards and their Sold/Demo statuses
  are static.
- Reference mattress selection lists "Revital 4.0 / Gentle" under area
  recommendations while store favourites gives the same mattress "Medium
  Soft". Taken from the rendered frame; the code export said "Medium Soft" in
  both, and the render is the one that matches the picker screens.
- "Home" is ambiguous across the app: **Back to Home** goes to Welcome (home
  for the selling flow), while every header logo goes to Personal Corner (the
  device's app launcher). Worth settling if both should mean one place.
- Three frames now carry the header gear (store favourites, welcome, leads).
  It should move into the shared `.setup-header` rather than being added page
  by page; it is on its third copy.
- Both snackbars duplicate ~12 lines of show/hide logic in their own page
  scripts. Worth extracting to one shared helper if a third appears.
- Store favourites caps at **4**: a fifth tap is refused and raises the
  snackbar instead. Deselecting is always allowed, and freeing a slot lets the
  next selection through. It opens with the design's four — Latex Plus,
  Eminence, Revital 4.0, Esteem — matching the "4 selected" on the card that
  leads there. Bed displays has no stated cap, so it enforces none.
- The snackbar node specifies **Roboto**, which the project does not ship.
  `font-family: Roboto, var(--font)` uses it where installed and falls back to
  the brand face rather than to Arial. Swap it to `var(--font)` outright if
  brand consistency matters more than matching the Material component.
- The two picker frames disagree by ~2px on the count row and rule (163/190 vs
  165/192). Treated as design drift: both screens use the bed-displays values
  so one shared component renders them.
- **The four gallery photos in `assets/img/mattress/` are 1920–3840px wide
  raster exports (3.3–17MB each, ~30MB together)** for a 360px-wide mobile
  frame with pinch-to-zoom. Not resized here — no image tool beyond macOS
  `sips` was available, which cannot recompress PNGs without a visible
  quality hit, and picking a target resolution for the zoomed view is a call
  the design should make. They stay well under GitHub Pages' file-size
  limits, but they are the bulk of the page weight; downscale and
  re-export them (or convert to WebP) before this needs to load quickly.

# rem-101-studios

A standalone version of the Rembrand × 101 Studios in-content gallery — a
cinematic snap-scroll reel of brand placements across Sheridan-verse TV
(Landman, Yellowstone, Lioness, Tulsa King, Mayor of Kingstown), with
on/off toggles to compare each frame with and without the placement.

Duplicated from the parent Marketing Site so the gallery can evolve as
its own project without dragging the rest of the marketing site along
for the ride.

## Run locally

This is a static site — no build step. Just serve the folder over HTTP
so the asset paths and font loading work as expected:

```bash
# from the rem-101-studios/ folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` will mostly work, but some
browsers block fonts or font-display behavior on the file protocol.

## Project layout

```
rem-101-studios/
├── index.html            # the gallery (was ica-gallery.html in Marketing Site)
├── styles.css            # shared stylesheet (carries marketing-page rules too,
│                         #   but they're scoped to selectors not present here)
├── script.js             # shared JS (gallery-specific logic is inline in index.html)
└── images/
    ├── logo.svg
    ├── logo-white.svg
    ├── gallery/          # slide-1..5 + matching -off variants
    └── icons/            # 101-studios.png, virtual-2d.svg, virtual-3d.svg
```

## What's different from the parent

* `ica-gallery.html` is renamed to `index.html` so the gallery loads at
  the project root.
* The footer's `Contact` link points to `#` instead of `contact.html`
  (no contact page in this project).
* Only the assets the gallery actually references were copied over —
  homepage/about/contact images and pages live elsewhere.

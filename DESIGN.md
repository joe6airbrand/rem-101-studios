# DESIGN.md — rem-101-studios

Master styleguide for any user-facing creative decision in this project.
Anything visible to a viewer of the gallery (typography, color, motion,
layout, copy tone) should be checked against this document before being
introduced or changed. When this file disagrees with code, this file
wins — update the code, then update this file if the intent has truly
shifted.

The single source of truth for tokens lives in `styles.css` under the
`:root` block. This document explains the *intent* behind those tokens
and the rules that govern how they're combined.

---

## 1. Brand voice & tone

The gallery sits at the intersection of two brands: Rembrand
(technology, precise, modern) and 101 Studios / the Sheridan-verse
(cinematic, weathered, premium, American). Every creative decision
should feel at home in both worlds.

* **Cinematic over corporate.** Prefer wide, quiet, confident framing
  over busy marketing layouts.
* **Premium over loud.** Restraint > ornament. Whitespace, slow motion,
  and tight typography do the heavy lifting.
* **Single subject per frame.** Each slide carries one idea — the
  placement and the world around it. No competing UI.

---

## 2. Color

| Token              | Hex       | Use                                                |
|--------------------|-----------|----------------------------------------------------|
| `--purple`         | `#6b46c1` | Brand primary — sparingly, accents only            |
| `--purple-600`     | `#5b3bb0` | Hover / pressed states for purple surfaces         |
| `--purple-700`     | `#4b2f95` | Deep accents, focus rings                          |
| `--purple-deep`    | `#2a1a52` | Dark backgrounds, gradient anchors                 |
| `--purple-darker`  | `#1a0b2e` | Near-black brand background                        |
| `--bg`             | `#ffffff` | Default page background                            |
| `--bg-soft`        | `#fafafa` | Section background separation                      |
| `--bg-grey`        | `#f4f4f6` | Quiet panels, inactive chrome                      |
| `--text`           | `#1f1f1f` | Primary text                                       |
| `--text-2`         | `#2f2f33` | Secondary text                                     |
| `--text-muted`     | `#6b7280` | Captions, metadata                                 |
| `--text-soft`      | `#8a8a93` | Disabled / hint                                    |
| `--border`         | `#e6e6ea` | Hairline dividers                                  |
| `--border-soft`    | `#f0f0f3` | Whisper-quiet dividers                             |

Rules:

* **Never introduce a new color** without adding it as a token here and
  in `:root`. Inline hex values in components are not allowed.
* Purple is a seasoning, not a base. The gallery is fundamentally a
  white/black/grey canvas with purple used to mark identity, focus,
  and one or two key affordances.
* Photography (the slides themselves) carries the color story. UI
  chrome stays neutral so the imagery can breathe.

---

## 3. Typography

* **Primary:** `halyard-display` (Adobe Fonts, loaded via Typekit in
  `index.html`).
* **Stand-in while previewing:** `Hanken Grotesk` (Google Fonts) — the
  closest free match in proportion and weight.
* **Fallback stack:** `Inter`, system sans, `Helvetica`, `Arial`.

Rules:

* `--font-sans` is the only typeface in the system. Do not introduce
  a second face without a documented reason here.
* Default `line-height` is `1.4`. Tighten to ~1.1 only for display
  type (>40px).
* Numerals should align (tabular) wherever they appear next to each
  other in lists or tables — this hasn't come up yet, but flag it
  here so we don't drift.

---

## 4. Layout & rhythm

| Token         | Value     | Purpose                                       |
|---------------|-----------|-----------------------------------------------|
| `--container` | `1180px`  | Max content width                             |
| `--gutter`    | `24px`    | Side padding inside the container             |
| `--radius`    | `12px`    | Default corner radius                         |
| `--radius-media` | `12px` | Media cards (slides, thumbnails)              |

Rules:

* Radii are **size-aware**: smaller surfaces use a tighter curve so
  the curve reads as proportional. Hero frames step up to `16px` only
  because the bigger surface earns the bigger curve.
* The gallery is a **snap-scroll reel**. Each slide must occupy one
  viewport. Don't let any UI bleed between slides.
* Reserve scrollbar gutter at all times (`scrollbar-gutter: stable`)
  so chrome doesn't shift when overflow toggles.

---

## 5. Motion

* The gallery's signature motion is the **slow Ken-Burns pan** on each
  slide while it's in view (see `--pan`, `--image-pan` in `styles.css`).
* Pan budget is capped tight (~110% zoom) — we are pulling the eye,
  not announcing the motion.
* All transitions ease into rest. Avoid bouncy easings.
* Respect `prefers-reduced-motion: reduce` — disable Ken-Burns and
  any auto-advance behavior when the user has opted out.

---

## 6. Imagery

* Slides come in **on / off pairs**: `slide-N.*` and `slide-N-off.*`.
  The toggle is the core interaction — the two states must be pixel
  aligned, exposure matched, and crop matched.
* Treat slide imagery as cinema: respect the original frame's grain,
  contrast, and color. Do not re-grade slides to match brand purple.
* Logos (`logo.svg`, `logo-white.svg`, `icons/101-studios.png`) live
  in chrome only, never on top of imagery without a scrim.

---

## 7. Copy

* Sentence case for everything except product names and proper nouns.
* No exclamation marks in UI copy.
* Episode / show references should match the canonical Sheridan-verse
  spelling: *Landman*, *Yellowstone*, *Lioness*, *Tulsa King*,
  *Mayor of Kingstown*.

---

## 8. Accessibility

* Color contrast: text on background must clear WCAG AA (4.5:1 for
  body, 3:1 for large display type). Re-check whenever a new color
  pairing is introduced.
* All interactive controls (the on/off toggle, nav arrows) must be
  reachable by keyboard and have a visible focus ring (`--purple-700`).
* Provide alt text on every slide image describing what the placement
  is and what's happening in the frame.

---

## 9. How to evolve this document

* When you make a user-facing change that this file did not anticipate,
  update this file in the same change. Code and DESIGN.md ship together.
* Prefer **tightening** rules over loosening them. If you're tempted
  to add a "sometimes you can do X", first ask whether the existing
  rule should just absorb that case.
* Never delete a rule silently. If a rule is being retired, leave a
  one-line note under the section explaining why.

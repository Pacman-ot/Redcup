# RedCup design audit

Checked on the production build (`next build` + `next start`) with headless Chromium at 1440x900, 1280x720 and 390x844, in light and dark. Every box passes.

**Design read:** a two-sided marketplace site for Indian Instagram creators (who pay) and the brands and agencies who browse and hire them, in a bold, live-auction language, built on Next.js 16 + Tailwind v4 + Motion.

**Dials:** DESIGN_VARIANCE 7, MOTION_INTENSITY 5, VISUAL_DENSITY 5 (unchanged from the approved Step 1).

**What changed from the static preview:** the old page had 9 sections of small text, grey placeholder photos and a muted rose-on-charcoal palette. This build uses 7 home sections with more space, big expanded type, one saturated brand red, real photos of people chosen one by one, and a live podium as the signature moment.

## 1. Em-dash audit

| Scope | U+2014 em-dash | U+2013 en-dash |
| --- | --- | --- |
| All source files in `src/`, `README.md`, configs | 0 | 0 |
| Rendered HTML of `/`, `/board`, `/board?window=today`, `/c/tara.frames`, `/c/zoya.strings`, `/brands`, `/claim`, `/rules`, `/terms`, `/privacy`, 404 | 0 | 0 |

Also zero middle dots (U+00B7) and zero arrow characters. `AGENTS.md` and `CLAUDE.md`, which `next dev` writes by itself, are not part of the site and are left out of the zip.

## 2. Section-layout-repetition audit (home page)

| # | Section | Layout family |
| --- | --- | --- |
| 1 | Hero | Asymmetric split: headline left, live podium (a real component) right |
| 2 | The rules in numbers | Stat row of four large numerals |
| 3 | How it works | Sticky scroll story: steps scroll, picture stays pinned and changes |
| 4 | Chasing the cup | Horizontal scroll-snap carousel |
| 5 | For brands | Bento grid, 4 cells of mixed size |
| 6 | FAQ | Sticky title column + accordion |
| 7 | Closing CTA | Full-bleed photo with theme-aware scrim |

7 sections, 7 families. Only the hero pairs text with an image side by side, so the zigzag cap is never reached.

Other pages: `/brands` uses split hero + photo collage, statement + icon list, numbered timeline, form panel, accordion (5 families in 5 sections). `/c/[handle]` uses split profile, stat row, photo grid, timeline + ranked list.

## 3. Hero discipline audit

| Check | Home 1440x900 | Home 1280x720 | Brands 1440x900 | Limit |
| --- | --- | --- | --- | --- |
| Headline lines | 2 | 2 | 2 | max 2 |
| Subtext words | 19 | 19 | 20 | max 20 |
| Subtext lines | 3 | 3 | 3 | max 4 |
| CTA bottom edge | 678 px | 592 px | 608 px | inside the viewport |
| Text elements | 3 | 3 | 3 | max 4 |
| CTAs | 1 primary + 1 secondary | same | same | max 1 + 1 |
| Top padding | 56 px | 56 px | 80 px | max 96 px |

## 4. Pre-Flight Check (Section 14)

- **Brief inference declared:** Pass. Stated above and approved in Step 1.
- **Dial values explicit:** Pass. 7 / 5 / 5, reasoned in Step 1.
- **Design system:** Pass. No official system fits; honest stack is Tailwind v4 utilities + Motion + Phosphor.
- **Redesign mode:** Pass. Overhaul of our own static preview; retired patterns listed at the top.
- **Zero em-dashes:** Pass. See audit 1.
- **Page Theme Lock:** Pass. Theme follows the visitor's system; no section inverts. Red panels are brand colour in both themes, and the closing photo's scrim switches with the theme.
- **Color Consistency Lock:** Pass. One accent, RedCup red `#D42A20`; dark mode uses a lighter tint of the same hue (`#EE6457`) for red text only.
- **Shape Consistency Lock:** Pass. Documented in `globals.css`: controls are pills, containers 20px, avatars circles.
- **Button Contrast:** Pass. Primary buttons 4.82:1; the lowest normal-text pair on the site is 4.56:1.
- **CTA Button Wrap:** Pass. No button taller than one line at 1440 or 1280.
- **Form Contrast:** Pass. Labels 16.5:1, help text and placeholders 6.1:1 or better, errors 4.56:1 or better, visible focus ring.
- **Serif discipline:** Pass. No serif; Archivo only.
- **Premium-consumer palette:** Pass. Not a premium-consumer brief; no beige, brass or espresso.
- **Italic descender clearance:** Pass. No italic display type.
- **Hero fits the viewport:** Pass. See audit 3.
- **Hero top padding:** Pass. 56 px.
- **Hero stack discipline:** Pass. Headline, subtext, CTAs. The podium caption belongs to the podium component.
- **Eyebrow count:** Pass. Home has 1 (limit 3); every other page has 0.
- **Split-Header Ban:** Pass. Headers stack; the carousel header's right side holds working scroll buttons.
- **Zigzag Alternation Cap:** Pass.
- **No Duplicate CTA Intent:** Pass. One label per intent on every page: "Claim your rank", "See the board", "Create brand account", "Send collab request".
- **Logo wall = logo only:** Pass. No logo wall; there are no real customers to show.
- **Bento Background Diversity:** Pass. Two photo cells, one red-tint cell, one darker cell.
- **Trusted-by wall under hero:** Pass. Not used.
- **Copy Self-Audit:** Pass. Every string re-read; fixed a 404 headline that contradicted its photo, removed an FAQ answer promising an unbuilt feature, and made the demo checkout copy say plainly that no money moves.
- **Motion motivated:** Pass. Podium entrance (hierarchy), sample bids and board re-ranking (the product's core mechanic), rupee counters (state change), step picture swap (storytelling), dialog and claim-step transitions and button presses (feedback).
- **Marquee max one:** Pass. None.
- **Navigation one line, 80 px max:** Pass. One row, 64 px.
- **Section-Layout-Repetition:** Pass. See audit 2.
- **Bento rhythm and exact cell count:** Pass. 4 items, 4 cells.
- **Long lists use the right component:** Pass. Marketing pages show 3 on the podium and 8 in a carousel; FAQs use accordions; the full list lives on `/board`, which is a product page.
- **Real images:** Pass. Lorem Picsum photos picked one by one for people and creator scenes; the hero preview is live UI, not a div mock-up.
- **No pills on images:** Pass. Names, ranks and amounts sit below photos.
- **No photo-credit captions:** Pass.
- **No version footers:** Pass.
- **No micro-meta sentences under eyebrows:** Pass.
- **No decoration strip at hero bottom:** Pass.
- **No floating top-right sub-text:** Pass.
- **No progress bars with tracks as comparisons:** Pass. The claim flow's step indicator shows progress through a form, not a comparison.
- **No locale strips:** Pass. City names appear only as creator data and filters.
- **No scroll cues:** Pass.
- **No version labels in hero:** Pass.
- **No section-numbering eyebrows:** Pass. The only numbers mark a real sequence (the brand steps) and real ranks.
- **No decorative dots:** Pass. The only dots are rank-history nodes, each marking a real payment.
- **No border on every row:** Pass. FAQ rows use one divider each; board rows use spacing and fills.
- **Content density:** Pass. Section paragraphs are 25 words or fewer; every figure is either a rule from `ranking.ts` or labelled sample data.
- **Quotes 3 lines max:** Pass. No testimonials; inventing them would be fake.
- **Motion claimed = motion shown:** Pass. The podium swaps leaders every 6.5 s and the board re-ranks every 7 s.
- **GSAP skeletons:** Pass. GSAP not used.
- **No window scroll listener:** Pass. IntersectionObserver only.
- **Reduced motion:** Pass. `MotionConfig reducedMotion="user"`, sample bids stop, CSS transitions carry `motion-reduce:transition-none`, smooth scrolling only with motion allowed.
- **Dark mode tested:** Pass. Screenshots checked in both themes.
- **Mobile collapse explicit:** Pass. Every page measured at 390 px with no sideways scroll.
- **Viewport stability:** Pass. `dvh` units only; no `h-screen` or `100vh`.
- **Effect cleanup:** Pass. Every interval, observer and key listener is removed on unmount.
- **Empty, loading and error states:** Pass. Board skeleton, empty and error states; inline form errors; code-expired and checkout-failed states.
- **Cards only where needed:** Pass.
- **Icons from an allowed library:** Pass. Phosphor only; the cup is a single geometric brand mark.
- **Motion in client leaves:** Pass. Every Motion import sits in a `"use client"` component; pages are server components.
- **No AI tells:** Pass. Archivo instead of Inter, no purple, no three identical cards, Indian names, no stock brand names.
- **Core Web Vitals plausible:** Pass. Hero photo has `priority`, every image reserves its space, fonts are self-hosted with `swap`. Lighthouse could not run in this sandbox.
- **One design system:** Pass.

# RedCup.in

A public board of Instagram creators, ranked by what they pay. Brands browse it free and send collab requests.

This is a working prototype: every page, form and API route runs, but the data is sample data and payments, Instagram verification and WhatsApp alerts are simulated.

## Run it

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For a production build: `npm run build`, then `npm start`. Type-check with `npm run typecheck`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: live podium hero, the rules in four numbers, how it works, ranks 4 to 11, brand features, FAQ |
| `/board` | The full board with All-time, This week and Today windows, niche and city filters, search, latest bids |
| `/c/[handle]` | Creator profile: ranks, stats, recent posts, rank history, collab request dialog |
| `/claim` | Five-step claim flow: handle, boards, amount, DM verification, payment |
| `/brands` | For brands: why it works, steps, brand account sign-up |
| `/rules` | Ranking rules and FAQ |
| `/terms`, `/privacy` | Draft legal pages (get them reviewed before launch) |

Query strings work on `/board` (`?window=today&niche=Travel&city=Kochi`) and `/claim` (`?amount=18500&niche=Travel&outrank=tara.frames`).

## Project layout

```
src/
  app/                  pages and API routes (Next.js App Router)
    api/board           GET  board for a window, niche, city or search
    api/claim/start     POST issue a 6-character DM code
    api/claim/verify    POST confirm the code (prototype accepts any issued code)
    api/checkout        POST create a demo order with GST
    api/brands/signup   POST brand account sign-up
    api/collab-requests POST brand to creator request
  components/           UI (client components are marked "use client")
  lib/
    creators.ts         sample creators, niches, cities, languages
    ranking.ts          all ranking rules and board maths
    validate.ts         handle, amount, email and GSTIN checks (shared by UI and API)
    picsum-loader.ts    image loader for the sample photos
  fonts/                Archivo variable font (OFL licence)
```

## The rules in code

All in `src/lib/ranking.ts`:

- `MIN_LISTING = 99`: minimum first payment, in rupees
- `TOP_STEP = 50`: taking #1 costs the current #1 plus this
- `RAISE_STEP = 10`: smallest raise for a creator already listed
- `GST_RATE = 0.18`
- Rank is total paid in the window. Equal totals keep the older listing above.
- Today resets at 00:00 IST, This week at Monday 00:00 IST.

## Sample data and photos

`src/lib/creators.ts` holds 25 invented creators. Payment dates are stored relative to today, so every board always has entries.

Photos are free Lorem Picsum images (Unsplash licence) chosen by ID and loaded through `src/lib/picsum-loader.ts`. They stand in for creator photos and must be replaced before launch: in production, store the profile photo Instagram returns at verification and point the image loader at your storage.

## Going live: what to replace

1. **Database.** Postgres with `creators`, `payments`, `verifications`, `brands`, `collab_requests`. Replace the in-memory map in `src/lib/claims-store.ts` and the sample list in `src/lib/creators.ts`.
2. **Instagram verification.** One Instagram Business account for RedCup, connected to a Facebook Page. Subscribe to the messaging webhook; when a DM arrives, read the sender's username with the User Profile API and mark the claim verified. Refresh follower counts daily with Business Discovery.
3. **Payments.** Razorpay orders in `api/checkout`. Write the rank only from the signed payment webhook, never from the browser.
4. **WhatsApp alerts.** Outbid alerts and collab requests through a WhatsApp Business provider.
5. **GST invoices** for every payment.
6. **Legal.** Lawyer review of `/terms` and `/privacy`, a grievance officer, and ad-disclosure wording.

## Design system

- **Colour.** One accent, RedCup red `#D42A20`, on warm neutral greys. Tokens live in `src/app/globals.css`; light and dark follow the visitor's system setting.
- **Type.** Archivo variable. Headlines use the expanded width (`font-stretch: 118%`) at weight 800; body text is normal width.
- **Shape.** Buttons, chips and inputs are full pills. Photos, panels and rows use a 20px radius. Avatars are circles.
- **Motion.** Motion (`motion/react`) for the podium, board re-ranking, counters, dialogs and claim steps. Everything respects reduced-motion settings, and sample bids pause when the board is off screen.
- **Icons.** Phosphor.

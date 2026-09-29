# Aagara Thirupthi

A location-based, multi-service event marketplace mobile app — built with React Native (Expo) and TypeScript. Customers discover, compare and book event service providers (catering first, with decoration and audio also included, and the architecture ready for photography, DJ, transport and more later) based on location, budget, ratings, menu/pricing and availability.

This build covers the **customer-facing app** end to end, using realistic local mock data (no backend required to try it out). A Provider portal and Admin panel can be added later on the same data model.

## What's included

- **Onboarding & Auth** — branded intro, mobile number entry, OTP verification, first-time profile setup
- **Dashboard** — categories, nearby/popular/highly-rated providers, active enquiries at a glance
- **Category → Requirement → Search** — pick a service, describe the event (type, date, guests, budget, district), then browse matching providers
- **Filters** — distance, rating, capacity, veg-only, availability, sorting
- **Provider profile** — about, menu/packages with dish-level pricing, previous work gallery, reviews with a rating breakdown
- **Dish / package selection** — running total as items are picked
- **Enquiry flow** — submit, track status (Submitted → Reviewing → Responded → Confirmed → Completed), call/WhatsApp the provider, confirm a booking
- **Ratings & reviews** — rate a completed booking across quality, communication, value and timeliness
- **Profile & notifications**

## Getting started

You'll need [Node.js](https://nodejs.org) (18+) installed. Then, from this folder:

```bash
npm install
npx expo start
```

This prints a QR code. Scan it with the **Expo Go** app on your phone (Android: Play Store, iOS: App Store) to run Aagara Thirupthi instantly — no build step needed.

Other options from the same `expo start` screen:
- Press `a` to open in an Android emulator
- Press `i` to open in an iOS simulator (Mac only)
- Press `w` to run in a web browser

## Project structure

```
src/
  theme/        Colors, typography, spacing — the design system tokens
  components/   Reusable UI: Button, Card, Chip, ProviderCard, FilterSheet, etc.
  data/         Mock providers, categories, districts, and TypeScript types
  store/        App state (Zustand) — auth, requirement/filters, cart, enquiries, notifications
  navigation/   React Navigation stacks/tabs
  screens/      auth/ · home/ · discovery/ · booking/ · profile/
  utils/        Formatting and filtering helpers
```

## Swapping in real data later

Everything the UI reads comes from `src/data/providers.ts` and the Zustand stores in `src/store/`. To connect a real backend:

1. Replace the static arrays in `src/data/` with API calls (the `Provider`, `Enquiry`, etc. types in `src/data/types.ts` already match the shapes the screens expect).
2. Swap the demo OTP check in `src/screens/auth/OtpScreen.tsx` for a real SMS/OTP provider.
3. Replace the in-memory Zustand stores with API-backed versions (or keep Zustand and just have its actions call your API).

## Notes

- Provider and portfolio images are placeholder photos (picsum.photos) — swap in real photography when you have it.
- App icon/splash use Expo's default placeholder graphics in `assets/` — replace these with your logo before publishing to the app stores.
- Built on Expo SDK 57 / React Native 0.86 / React 19, TypeScript throughout.

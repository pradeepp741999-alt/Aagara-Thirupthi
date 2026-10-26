# Aagara Thirupthi (ஆகார திருப்தி) — Complete Project Documentation

> **Version:** 1.0.0  
> **Platform:** React Native (Expo SDK 57) / React 19 / TypeScript  
> **Target OS:** Android, iOS, and Web  
> **Market Focus:** Salem & Tamil Nadu Event Marketplace  

---

## 1. Project Overview & Vision

**Aagara Thirupthi** is a hyper-local, multi-category event service marketplace designed to connect event organizers, families, and individuals in Salem and Tamil Nadu with verified, top-tier event service professionals.

The application simplifies finding, comparing, customizing, and booking event providers across four primary categories:
1. **Catering & Feasts** (Traditional banana leaf meals, buffet packages, multi-cuisine catering)
2. **Stage & Venue Decoration** (Floral backdrops, lighting, theme setups, muhurtham mandaps)
3. **Audio & Sound Engineering** (Line array sound systems, DJ setups, live mikes, orchestra)
4. **Bridal Makeup & Makeovers** (HD bridal makeup, airbrush styling, saree draping, groom styling)

---

## 2. Technical Stack & Architecture

### Core Technologies
- **Runtime & Framework:** React Native `0.86.2` via Expo SDK `57.0.16`
- **Language:** TypeScript `~6.0.3` (Strict type safety across models, stores, and screens)
- **UI & Web Engine:** React `19.2.3`, `react-dom` `19.2.3`, `react-native-web` `^0.21.2`
- **Navigation Architecture:** `@react-navigation/native` `^7.3.18`, `@react-navigation/native-stack` `^7.18.10`, `@react-navigation/bottom-tabs` `^7.18.18`
- **State Management:** Zustand `^5.0.15` (Lightweight, unopinionated, performant reactive stores)
- **Typography & Icons:** `@expo/vector-icons` `^15.1.1` (Ionicons), `@expo-google-fonts/plus-jakarta-sans` `^0.4.2`
- **Visuals & Gradients:** `expo-image` `^57.0.3`, `expo-linear-gradient` `^57.0.1`

### Architectural Pattern
```
┌────────────────────────────────────────────────────────┐
│                   React Native UI Layer                │
│  (Screens, Reusable Components, Modals, Navigators)    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Zustand Stores                      │
│   (Auth, Cart, Requirement, Enquiries, Notifications,   │
│                 Provider Availability)                 │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Utils & Core Engines                  │
│ (Haversine Distance, MonthCalendar Math, Currency,     │
│             Filters, Staffing Calculators)             │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│           Data Layer / REST API Backend Layer          │
│   (types.ts, providers.ts, districts.ts, categories.ts)│
└────────────────────────────────────────────────────────┘
```

---

## 3. Core Highlights & Business Features

### 3.1. Geolocation & Real-Time Proximity (U2)
- **Dual Location Engine:**
  1. **Device GPS Auto-Detection:** Uses `navigator.geolocation.getCurrentPosition` to request real-time browser/device coordinates.
  2. **Manual Salem Locality Fallback:** If GPS permission is denied or dismissed, users can select or search their exact Salem area (*Fairlands, Hasthampatti, Alagapuram, Junction, Shevapet, Ammapet, Suramangalam*, etc.) or any Tamil Nadu district.
- **Dynamic Distance Calculation:** Integrated Haversine formula calculates accurate distances (`distanceKm`) between user coordinates and provider premises, sorting **Nearby Providers** in real time.

### 3.2. Month-View Wall Calendar & Availability (P7)
- **Full Month Calendar Component:** Replaced traditional 10-day strips with a month wall calendar featuring `<` and `>` month navigation.
- **Provider Date Management:** Providers can mark dates as **Available (Green)**, **Blocked (Red)**, or **Booked (Amber)**.
- **Consumer Safeguard:** During customer booking flows, blocked or booked dates are non-selectable, preventing scheduling conflicts.

### 3.3. Multi-Day Makeover & Same-Time Backup Artist Allocation
- **From Date → To Date Range Concept:** When booking Bridal Makeup, users can select an event date range (e.g., Mehendi on Day 1 to Muhurtham on Day 2).
- **Simultaneous Styling Logic:** When 2 or more individuals require makeover at the **same time**:
  - The system allocates **1 Lead Makeup Artist + 1 Assistant / Backup Artist**.
  - Guarantees both persons are ready concurrently without delaying wedding ceremonies.
- **Sequential Option:** If styling can be staggered, 1 Lead Artist is assigned (~1.5–2 hrs per person).

### 3.4. Special Combos & Provider Deal Creation (P6)
- **Home Screen Deal Cards:** Showcases curated celebration packages with original price, deal price, validity date, and included item tags.
- **Provider Publishing Modal:** Providers can tap `+ Create Combo` directly on Home to publish custom packages with photos and pricing.

### 3.5. Dish Catalog with Photos & Dynamic Packages (P5)
- **Dish-Level Menus:** Displays dish thumbnails, veg/non-veg badges, and item-by-item pricing.
- **Live Cart Calculator:** Real-time estimation of total costs based on selected items, guest counts, and service packages.

### 3.6. Complete Enquiry & Booking Lifecycle
Supports a multi-stage status stepper:
```
Submitted ──▶ Provider Reviewing ──▶ Quote Sent / Responded ──▶ Confirmed ──▶ Completed
    │                                                                   │
    └───────────────────────▶ Cancelled ◀───────────────────────────────┘
```
- Direct customer-to-provider phone calls and WhatsApp messaging.
- In-app quote review and acceptance.

---

## 4. Project Directory Structure

```
AagaraThirupthi/
├── assets/                          # App icons, splash screens, and static images
├── src/
│   ├── components/                  # Reusable Atomic UI Components
│   │   ├── Avatar.tsx               # User profile avatar with initials and color
│   │   ├── Badge.tsx                # StatusBadge, VerifiedBadge, AvailabilityBadge
│   │   ├── Button.tsx               # Primary, outline, ghost buttons with scaling feedback
│   │   ├── Card.tsx                 # Base card container with elevation and rounded borders
│   │   ├── Chip.tsx                 # Selectable chip filters and category pills
│   │   ├── EmptyState.tsx           # Fallback view for empty lists or zero search results
│   │   ├── FilterSheet.tsx          # Bottom sheet modal for multi-attribute filtering
│   │   ├── Input.tsx                # Form text input with floating label, icons, and validation
│   │   ├── MonthCalendar.tsx        # Month-view calendar with From/To range selection
│   │   ├── ProgressSteps.tsx        # Horizontal stepper for multi-step booking
│   │   ├── ProviderCard.tsx         # Comprehensive provider preview card with ratings and distance
│   │   ├── RatingStars.tsx          # 5-star interactive rating display
│   │   ├── ScreenHeader.tsx         # Standard screen navigation header with back button
│   │   ├── SearchBar.tsx            # Styled search input with clear button
│   │   ├── SectionHeader.tsx        # Section title with optional action link (e.g. "+ Create Combo")
│   │   ├── Stepper.tsx              # Numeric +/- counter for guests and persons
│   │   ├── SummaryCard.tsx          # Quick stat highlight card
│   │   ├── TileButton.tsx           # Square icon tile for quick actions and category entry
│   │   └── index.ts                 # Central component export barrel
│   │
│   ├── data/                        # Domain Models & Seed Data
│   │   ├── categories.ts            # Service categories (Catering, Decoration, Audio, Makeup)
│   │   ├── districts.ts             # Tamil Nadu districts and Salem localities
│   │   ├── providers.ts             # Realistic mock provider catalog and special combos
│   │   ├── seed.ts                  # Mock enquiries, reviews, event types, notifications
│   │   ├── types.ts                 # TypeScript interfaces for the entire platform
│   │   └── index.ts                 # Data export barrel
│   │
│   ├── navigation/                  # React Navigation Routing
│   │   ├── AuthNavigator.tsx        # Stack: Onboarding -> Login -> Otp -> ProfileSetup
│   │   ├── MainTabNavigator.tsx     # Bottom Tabs: Dashboard, Explore, Enquiries, Profile
│   │   ├── RootNavigator.tsx        # Top-level Stack connecting Auth, Tabs, and Flows
│   │   └── types.ts                 # ParamList definitions for all navigation stacks
│   │
│   ├── screens/                     # 19 Screen Views
│   │   ├── auth/                    # Authentication Flow
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── OtpScreen.tsx
│   │   │   └── ProfileSetupScreen.tsx
│   │   ├── discovery/               # Discovery & Provider Selection Flow
│   │   │   ├── CategorySelectScreen.tsx
│   │   │   ├── ProviderDetailScreen.tsx
│   │   │   ├── RequirementFormScreen.tsx
│   │   │   └── SearchResultsScreen.tsx
│   │   ├── booking/                 # Customization & Booking Flow
│   │   │   ├── DishSelectionScreen.tsx
│   │   │   ├── EnquiriesListScreen.tsx
│   │   │   ├── EnquiryDetailScreen.tsx
│   │   │   ├── EnquiryFormScreen.tsx
│   │   │   ├── EnquirySuccessScreen.tsx
│   │   │   └── RatingReviewScreen.tsx
│   │   ├── home/                    # Main Hub
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── ExploreScreen.tsx
│   │   │   └── NotificationsScreen.tsx
│   │   └── profile/                 # User Profile Management
│   │       ├── EditProfileScreen.tsx
│   │       └── ProfileScreen.tsx
│   │
│   ├── store/                       # Zustand Reactive State
│   │   ├── useAuthStore.ts          # Authentication token & customer profile
│   │   ├── useCartStore.ts          # Dish selections, package quantities, running total
│   │   ├── useEnquiryStore.ts       # Enquiry submission, status updates, history
│   │   ├── useNotificationStore.ts  # In-app notifications & unread count badge
│   │   ├── useProviderStore.ts      # Provider date calendars & special combos
│   │   └── useRequirementStore.ts   # Event type, date range, staffing requirements, search filters
│   │
│   ├── theme/                       # Design System Tokens
│   │   ├── colors.ts                # Palette (Primary, Secondary, Surface, Ink, Status colors)
│   │   ├── images.ts                # Asset image references
│   │   ├── spacing.ts               # 4-point spacing grid and border radii
│   │   ├── typography.ts            # Type scale and font hierarchy
│   │   └── index.ts                 # Theme export barrel
│   │
│   └── utils/                       # Business Logic & Utility Functions
│       ├── currency.ts              # INR currency formatter (`₹XX,XXX`)
│       ├── date.ts                  # Long and short date formatters
│       ├── distance.ts              # Haversine geographic distance formula & coordinates
│       └── filterProviders.ts       # Multi-criteria provider filtering engine
│
├── API_DOCUMENTATION.md             # Complete REST API Specification (Endpoints, Requests, Responses)
├── app.json                         # Expo configuration manifest
├── index.ts                         # Application entrypoint
├── package.json                     # NPM dependencies and scripts
├── tsconfig.json                    # TypeScript compiler options
└── PROJECT_DOCUMENTATION.md         # Master Project Documentation (This file)
```

---

## 5. Complete Screen Catalog (19 Screens)

| # | Screen Name | Route | Module | Key Capabilities |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Onboarding** | `Onboarding` | Auth | Branded welcome carousel, benefits overview, quick start |
| **2** | **Login** | `Login` | Auth | Mobile phone number input, terms agreement, OTP trigger |
| **3** | **OTP Verification** | `Otp` | Auth | 6-digit numeric OTP entry, countdown timer, resend trigger |
| **4** | **Profile Setup** | `ProfileSetup` | Auth | First-time user setup: Full Name, District, Salem locality |
| **5** | **Dashboard / Home** | `Dashboard` | Main Tab | GPS location button, manual location fallback modal, category tiles, Special Combos showcase, "+ Create Combo" modal, Nearby Providers, active enquiry summary |
| **6** | **Explore** | `Explore` | Main Tab | Full provider directory, live search, district & category filter chips |
| **7** | **Category Select** | `CategorySelect` | Discovery | Category cards with descriptions, starting pricing, and service highlights |
| **8** | **Requirement Form** | `RequirementForm` | Discovery | Event type, From/To multi-day MonthCalendar, guest/person count, simultaneous styling / backup artist card, budget range, notes |
| **9** | **Search Results** | `SearchResults` | Discovery | Filtered and distance-ranked providers, sorting options (Rating, Distance, Price, Relevance), FilterSheet modal |
| **10** | **Provider Detail** | `ProviderDetail` | Discovery | Cover gallery, stats, verified badge, About tab, Live Availability MonthCalendar tab with provider date manager modal, Previous Work gallery, Reviews |
| **11** | **Dish Selection** | `DishSelection` | Booking | Categorized menu dishes with photos, packages, veg/non-veg filter, quantity controls, sticky running cart total |
| **12** | **Enquiry Form** | `EnquiryForm` | Booking | Event summary editor, From/To dates, makeup simultaneous styling staffing card, location input, custom notes, Submit Enquiry |
| **13** | **Enquiry Success** | `EnquirySuccess` | Booking | Confirmation card, generated Enquiry ID, next step timeline, call/WhatsApp provider buttons |
| **14** | **Enquiries List** | `Enquiries` | Main Tab | All active and historic enquiries, status badges, quote amounts, direct link to details |
| **15** | **Enquiry Detail** | `EnquiryDetail` | Booking | Complete lifecycle stepper, provider response quote, stylist staffing breakdown, Accept Quote button, contact triggers |
| **16** | **Rating & Review** | `RatingReview` | Booking | Post-event rating, 4-pillar scores (Quality, Communication, Value, Timeliness), text review submission |
| **17** | **Notifications** | `Notifications` | System | List of alerts (Quotes, status changes, promotions), mark single/all as read |
| **18** | **Profile** | `Profile` | Main Tab | Customer profile summary, active enquiries link, help, logout |
| **19** | **Edit Profile** | `EditProfile` | Profile | Edit name, WhatsApp number, alternate contact, primary Salem locality |

---

## 6. Reactive State Stores (Zustand)

| Store File | Responsibilities | Key Actions / Methods |
| :--- | :--- | :--- |
| **`useAuthStore`** | User session, login state, profile details | `setProfile(data)`, `saveProfile(data)`, `logout()` |
| **`useRequirementStore`** | Active search criteria, event dates, filters | `setCategory(c)`, `updateRequirement(r)`, `updateFilters(f)`, `resetFilters()` |
| **`useCartStore`** | Selected dishes and packages for catering | `addItem(item)`, `removeItem(id)`, `updateQty(id, qty)`, `clearCart()`, `total()` |
| **`useEnquiryStore`** | Submitted customer enquiries & status tracking | `submitEnquiry(data)`, `updateStatus(id, status)`, `markReviewed(id)`, `getById(id)` |
| **`useProviderStore`** | Special combos and per-provider calendar maps | `addSpecialCombo(c)`, `removeSpecialCombo(id)`, `setDateStatus(pId, date, s)`, `toggleDateStatus(pId, date)` |
| **`useNotificationStore`** | Notifications feed and unread counter | `addNotification(n)`, `markAsRead(id)`, `markAllAsRead()`, `unreadCount()` |

---

## 7. Data Models & TypeScript Interfaces

Key domain definitions located in [`src/data/types.ts`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/data/types.ts):

```typescript
// Service Category Types
export type ServiceCategoryId = 'catering' | 'decoration' | 'audio' | 'makeup';

// Special Combo Package
export interface SpecialCombo {
  id: string;
  providerId: string;
  providerName: string;
  category: ServiceCategoryId;
  name: string;
  description: string;
  includedItems: string[];
  price: number;
  originalPrice?: number;
  image: string;
  validUntil: string;
  badge?: string;
}

// Event Requirement Specification
export interface EventRequirement {
  eventType: string;
  eventDate: string;           // ISO start date (From Date)
  eventEndDate?: string;       // ISO end date (To Date)
  district: string;
  location: string;
  guestCount: number;
  makeupPersonsCount?: number;
  simultaneousStyling?: boolean; // True if persons require styling at the exact same hour
  backupArtistNeeded?: boolean;  // True if backup/assistant artist is assigned
  category: ServiceCategoryId;
  budgetMin: number;
  budgetMax: number;
  notes?: string;
}

// Enquiry & Booking Status
export type EnquiryStatus =
  | 'submitted'
  | 'provider_reviewing'
  | 'provider_responded'
  | 'accepted'
  | 'quote_sent'
  | 'customer_reviewing'
  | 'confirmation_pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface Enquiry {
  id: string;
  providerId: string;
  providerName: string;
  category: ServiceCategoryId;
  createdAt: string;
  eventType: string;
  eventDate: string;
  eventEndDate?: string;
  location: string;
  guestCount: number;
  makeupPersonsCount?: number;
  simultaneousStyling?: boolean;
  backupArtistAssigned?: boolean;
  items: EnquiryItem[];
  estimatedTotal: number;
  notes?: string;
  status: EnquiryStatus;
  providerQuote?: number;
  providerMessage?: string;
  hasReview?: boolean;
}
```

---

## 8. REST API Specifications

The application communicates with a 25-endpoint REST API covering authentication, user profiles, provider catalogs, month calendar availability, special combos, enquiries, reviews, and notifications.

👉 **Refer to the dedicated [`API_DOCUMENTATION.md`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/API_DOCUMENTATION.md) for full HTTP endpoints, request headers, query parameters, request bodies, success schemas, and error codes.**

---

## 9. Getting Started & Development Guide

### 9.1. Prerequisites
- **Node.js:** `v20.x` or later (LTS recommended)
- **Package Manager:** `npm` (bundled with Node.js)
- **Mobile Testing:** Expo Go app installed on your physical Android or iOS device.

### 9.2. Installation
Clone or navigate to the project root directory:
```bash
cd D:\downloads\AagaraThirupthi\AagaraThirupthi
npm install
```

### 9.3. Running the Development Server
To launch the Expo development bundler:
```bash
npx expo start
```

#### Platform Shortcuts in Terminal:
- **`w`** — Opens the application in your default web browser (serves at `http://localhost:8081`).
- **`a`** — Launches Android emulator.
- **`i`** — Launches iOS simulator (macOS required).
- **`r`** — Reloads the application.

To run directly on the web:
```bash
npm run web
# or
npx expo start --web
```

---

## 10. Production Build & Deployment

### 10.1. Web Deployment (Vercel / Netlify / Cloudflare Pages)
Export the static web bundle:
```bash
npx expo export --platform web
```
The compiled assets will be generated in the `dist/` directory, ready to deploy to any CDN or static hosting platform.

### 10.2. Native Android (APK / AAB) & iOS (IPA)
Configure [Expo Application Services (EAS)](https://expo.dev/eas):
```bash
npm install -g eas-cli
eas login
eas build:configure
```
- **Android APK (Preview):** `eas build -p android --profile preview`
- **Android AAB (Google Play):** `eas build -p android --profile production`
- **iOS App (Apple App Store):** `eas build -p ios --profile production`

---

## 11. Maintenance & Extension Guidelines

1. **Adding a New Category (e.g. Photography, Transport):**
   - Add the ID to `ServiceCategoryId` in `src/data/types.ts`.
   - Add the metadata (name, icon, theme color) to `src/data/categories.ts`.
   - The Home screen, search filters, and booking flow will automatically adopt the new category.
2. **Connecting Real Backend APIs:**
   - Create an API client in `src/api/client.ts` using `fetch` or `axios`.
   - Replace mock Zustand store operations with asynchronous API calls following the schema in `API_DOCUMENTATION.md`.
   - Swap the test OTP in `OtpScreen.tsx` with your SMS gateway provider (e.g., Twilio, Gupshup, Fast2SMS).

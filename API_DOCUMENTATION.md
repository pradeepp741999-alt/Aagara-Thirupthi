# Aagara Thirupthi — API & Screen Architecture Documentation

Comprehensive audit and technical specification of all **Screens** and **REST APIs** for the Aagara Thirupthi Application.

---

## 1. Executive Summary

| Metric | Count | Details |
| :--- | :--- | :--- |
| **Total Screens** | **19** | Auth (4), Home & Discovery (7), Booking & Enquiry (6), Profile (2) |
| **Total Unique REST APIs** | **25** | Auth (3), User (3), Master Data (3), Providers (5), Combos (2), Enquiries (4), Reviews (2), Notifications (3) |
| **Screen-API Integrations** | **36** | Total API interactions mapped across all 19 screens |
| **Architecture Standard** | RESTful JSON | JWT Bearer Authentication, Haversine Distance Calculation |

---

## 2. Screen-by-Screen API Matrix

| S.No | Screen Name | Route / Path | Primary Purpose | Number of APIs |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Onboarding Screen** | `Onboarding` | Welcome carousel & value proposition | **1** |
| 2 | **Login Screen** | `Login` | Mobile number entry & OTP trigger | **1** |
| 3 | **OTP Verification Screen** | `Otp` | 6-digit OTP verification & resend | **2** |
| 4 | **Profile Setup Screen** | `ProfileSetup` | New user name, district & area setup | **1** |
| 5 | **Home / Dashboard Screen** | `Dashboard` (Main Tab) | Categories, GPS/manual location, special combos, nearby providers, badges | **7** |
| 6 | **Explore Screen** | `Explore` (Main Tab) | Global search, filter chips & provider directory | **3** |
| 7 | **Category Select Screen** | `CategorySelect` | Category catalog with pricing & descriptions | **1** |
| 8 | **Requirement Form Screen** | `RequirementForm` | Multi-day date picker, makeup staffing, event inputs | **3** |
| 9 | **Search Results Screen** | `SearchResults` | Filtered provider matching & sorting | **2** |
| 10 | **Provider Detail Screen** | `ProviderDetail` | Full portfolio, month calendar availability, reviews | **4** |
| 11 | **Dish / Package Selection Screen** | `DishSelection` | Menu dishes with photos, packages & cart | **2** |
| 12 | **Enquiry Form Screen** | `EnquiryForm` | From/To dates, makeup staffing, custom notes, submission | **2** |
| 13 | **Enquiry Success Screen** | `EnquirySuccess` | Confirmation & timeline view | **1** |
| 14 | **Enquiries List Screen** | `Enquiries` (Main Tab) | Active & past enquiry list with status pills | **1** |
| 15 | **Enquiry Detail Screen** | `EnquiryDetail` | Stepper status, provider quote & response | **2** |
| 16 | **Rating & Review Screen** | `RatingReview` | Provider rating stars & review submission | **2** |
| 17 | **Notifications Screen** | `Notifications` | Real-time enquiry alerts & quote updates | **3** |
| 18 | **Profile Screen** | `Profile` (Main Tab) | Customer profile overview & logout | **2** |
| 19 | **Edit Profile Screen** | `EditProfile` | Update personal details & Salem locality | **1** |
| **TOTAL** | **19 Screens** | | | **36 Calls (25 Unique APIs)** |

---

## 3. Detailed Screen-by-Screen API Breakdown

---

### Screen 1: Onboarding Screen
- **File**: [`src/screens/auth/OnboardingScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/auth/OnboardingScreen.tsx)
- **Route**: `Onboarding`
- **Total APIs**: **1**

#### API 1.1: Fetch Onboarding Slides & Banners
- **Endpoint**: `GET /api/v1/app/onboarding`
- **Description**: Loads dynamic banners, titles, and promotional highlights for the onboarding carousel.
- **Request Headers**: None (Public)
- **Response `200 OK`**:
```json
{
  "slides": [
    {
      "id": "slide_1",
      "title": "Welcome to Aagara Thirupthi",
      "subtitle": "Discover Salem's best catering, decor, makeup & sound services",
      "image": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
    }
  ]
}
```

---

### Screen 2: Login Screen
- **File**: [`src/screens/auth/LoginScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/auth/LoginScreen.tsx)
- **Route**: `Login`
- **Total APIs**: **1**

#### API 2.1: Request Mobile OTP
- **Endpoint**: `POST /api/v1/auth/send-otp`
- **Description**: Sends a 6-digit SMS OTP to the user's mobile number.
- **Request Body**:
```json
{
  "mobile": "9876543210"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "txnId": "txn_otp_893247",
  "expiresInSeconds": 300
}
```

---

### Screen 3: OTP Verification Screen
- **File**: [`src/screens/auth/OtpScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/auth/OtpScreen.tsx)
- **Route**: `Otp`
- **Total APIs**: **2**

#### API 3.1: Verify OTP & Authenticate
- **Endpoint**: `POST /api/v1/auth/verify-otp`
- **Description**: Validates the entered OTP, returns JWT token and user profile status.
- **Request Body**:
```json
{
  "mobile": "9876543210",
  "otp": "123456",
  "txnId": "txn_otp_893247"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": false,
  "user": {
    "id": "usr_9918",
    "name": "Kavitha Rajan",
    "mobile": "9876543210",
    "district": "Salem",
    "location": "Fairlands"
  }
}
```

#### API 3.2: Resend OTP
- **Endpoint**: `POST /api/v1/auth/resend-otp`
- **Description**: Re-triggers an OTP SMS when countdown expires.
- **Request Body**:
```json
{
  "mobile": "9876543210"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "New OTP sent",
  "txnId": "txn_otp_893248"
}
```

---

### Screen 4: Profile Setup Screen
- **File**: [`src/screens/auth/ProfileSetupScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/auth/ProfileSetupScreen.tsx)
- **Route**: `ProfileSetup`
- **Total APIs**: **1**

#### API 4.1: Create / Complete User Profile
- **Endpoint**: `POST /api/v1/user/profile`
- **Description**: Registers new user details including primary district and Salem locality.
- **Request Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "Kavitha Rajan",
  "district": "Salem",
  "location": "Fairlands",
  "whatsapp": "9876543210"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "user": {
    "id": "usr_9918",
    "name": "Kavitha Rajan",
    "mobile": "9876543210",
    "whatsapp": "9876543210",
    "district": "Salem",
    "location": "Fairlands",
    "avatarColor": "#8B5CF6"
  }
}
```

---

### Screen 5: Home / Dashboard Screen
- **File**: [`src/screens/home/DashboardScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/home/DashboardScreen.tsx)
- **Route**: `MainTabs -> Dashboard`
- **Total APIs**: **7**

#### API 5.1: Get Service Categories
- **Endpoint**: `GET /api/v1/categories`
- **Description**: Retrieves active service categories (Catering, Decoration, Audio & Sound, Makeup).
- **Response `200 OK`**:
```json
[
  { "id": "catering", "name": "Catering", "icon": "restaurant", "color": "#F97316" },
  { "id": "decoration", "name": "Decoration", "icon": "color-wand", "color": "#8B5CF6" },
  { "id": "audio", "name": "Audio & Sound", "icon": "musical-notes", "color": "#3B82F6" },
  { "id": "makeup", "name": "Bridal Makeup", "icon": "sparkles", "color": "#EC4899" }
]
```

#### API 5.2: Get Special Combos
- **Endpoint**: `GET /api/v1/combos/special`
- **Description**: Fetches curated celebration combo packages displayed in the Home horizontal scroll.
- **Response `200 OK`**:
```json
[
  {
    "id": "combo-1",
    "providerId": "prov-sri-annapoorna",
    "providerName": "Sri Annapoorna Caterers",
    "name": "Grand Muhurtham Feast (500 pax)",
    "description": "Complete traditional banana leaf feast with sweets, payasam & snacks",
    "includedItems": ["Welcome Drink", "4 Sweets", "Traditional Thali", "Dessert"],
    "price": 22000,
    "originalPrice": 28000,
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    "validUntil": "Valid till 30 Nov 2026",
    "badge": "DIWALI SPECIAL"
  }
]
```

#### API 5.3: Create Special Combo (Provider Action)
- **Endpoint**: `POST /api/v1/combos/special`
- **Description**: Allows providers to create and publish combo packages directly to the Home screen.
- **Request Body**:
```json
{
  "providerId": "prov-sri-annapoorna",
  "category": "catering",
  "name": "Festival Grand Combo",
  "description": "Exclusive festival package",
  "includedItems": ["Welcome Drinks", "5 Veg Curries", "Payasam"],
  "price": 18000,
  "originalPrice": 24000,
  "validUntil": "Valid till 31 Dec 2026",
  "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
}
```
- **Response `201 Created`**: Returns created combo object.

#### API 5.4: Get Nearby Providers (GPS Distance Sorted)
- **Endpoint**: `GET /api/v1/providers/nearby`
- **Query Parameters**:
  - `lat` (optional): User latitude (e.g. `11.6643`)
  - `lng` (optional): User longitude (e.g. `78.1460`)
  - `district`: User district (e.g. `Salem`)
  - `area`: User locality (e.g. `Fairlands`)
- **Description**: Returns providers sorted dynamically by Haversine distance.
- **Response `200 OK`**: Array of provider summaries with `distanceKm`.

#### API 5.5: Get Enquiries Summary
- **Endpoint**: `GET /api/v1/enquiries/summary`
- **Description**: Returns counts for active enquiries and items awaiting user response for Home summary card.
- **Response `200 OK`**:
```json
{
  "activeCount": 2,
  "awaitingResponseCount": 1
}
```

#### API 5.6: Get Unread Notification Count
- **Endpoint**: `GET /api/v1/notifications/unread-count`
- **Description**: Returns unread notifications count for header bell badge.
- **Response `200 OK`**:
```json
{
  "unreadCount": 3
}
```

#### API 5.7: Update User Location (Manual Fallback / GPS)
- **Endpoint**: `PATCH /api/v1/user/location`
- **Description**: Persists updated manual district/locality or GPS location.
- **Request Body**:
```json
{
  "district": "Salem",
  "location": "Alagapuram",
  "lat": 11.6750,
  "lng": 78.1380
}
```
- **Response `200 OK`**: Updated user profile.

---

### Screen 6: Explore Screen
- **File**: [`src/screens/home/ExploreScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/home/ExploreScreen.tsx)
- **Route**: `MainTabs -> Explore`
- **Total APIs**: **3**

#### API 6.1: Search & Filter Providers Directory
- **Endpoint**: `GET /api/v1/providers`
- **Query Parameters**: `category`, `district`, `query`, `page`, `limit`
- **Description**: Directory search across all verified Salem event service providers.
- **Response `200 OK`**: Paginated provider list with rating, starting price, and coverage areas.

#### API 6.2: Get Categories
- **Endpoint**: `GET /api/v1/categories` (Reusable)
- **Description**: Loads category filter pills.

#### API 6.3: Get Districts List
- **Endpoint**: `GET /api/v1/districts`
- **Description**: Returns list of Tamil Nadu districts with Salem highlighted.
- **Response `200 OK`**:
```json
[
  { "id": "salem", "name": "Salem", "isDefault": true },
  { "id": "namakkal", "name": "Namakkal", "isDefault": false }
]
```

---

### Screen 7: Category Select Screen
- **File**: [`src/screens/discovery/CategorySelectScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/discovery/CategorySelectScreen.tsx)
- **Route**: `CategorySelect`
- **Total APIs**: **1**

#### API 7.1: Get Detailed Category Metadata
- **Endpoint**: `GET /api/v1/categories/details`
- **Description**: Returns category cards with service scope, pricing hints, and active status.
- **Response `200 OK`**: Full category array.

---

### Screen 8: Requirement Form Screen
- **File**: [`src/screens/discovery/RequirementFormScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/discovery/RequirementFormScreen.tsx)
- **Route**: `RequirementForm`
- **Total APIs**: **3**

#### API 8.1: Get Category Event Types & Service Add-ons
- **Endpoint**: `GET /api/v1/config/event-types?category=makeup`
- **Description**: Returns dynamic event types (e.g. Bridal Muhurtham, Reception, Sangeet) and sub-services.
- **Response `200 OK`**:
```json
{
  "eventTypes": ["Bridal (Muhurtham)", "Reception", "Engagement", "Sangeet / Mehendi"],
  "services": ["HD Bridal Makeup", "Airbrush Makeover", "Saree Draping", "Bridal Hairstyling"]
}
```

#### API 8.2: Get Districts & Localities
- **Endpoint**: `GET /api/v1/districts` (Reusable)
- **Description**: Returns Salem localities (Fairlands, Hasthampatti, Junction, etc.).

#### API 8.3: Validate & Save Requirement Draft
- **Endpoint**: `POST /api/v1/requirements/draft`
- **Description**: Validates event date range (`eventDate`, `eventEndDate`), person count, and makeup staffing configuration.
- **Request Body**:
```json
{
  "category": "makeup",
  "eventType": "Bridal (Muhurtham)",
  "eventDate": "2026-11-15",
  "eventEndDate": "2026-11-16",
  "guestCount": 2,
  "makeupPersonsCount": 2,
  "simultaneousStyling": true,
  "backupArtistNeeded": true,
  "district": "Salem",
  "location": "Fairlands",
  "budgetMin": 15000,
  "budgetMax": 30000,
  "notes": "Need HD Bridal Makeup and Saree Draping"
}
```
- **Response `200 OK`**: Returns validated draft ID.

---

### Screen 9: Search Results Screen
- **File**: [`src/screens/discovery/SearchResultsScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/discovery/SearchResultsScreen.tsx)
- **Route**: `SearchResults`
- **Total APIs**: **2**

#### API 9.1: Match & Rank Providers by Requirement
- **Endpoint**: `POST /api/v1/providers/match`
- **Description**: Finds matching providers based on date range availability, capacity, location distance, and budget.
- **Request Body**: Complete requirement draft object.
- **Response `200 OK`**:
```json
{
  "totalMatches": 4,
  "providers": [
    {
      "id": "prov-glam-glow",
      "name": "Glow & Glamour Bridal Studio",
      "rating": 4.9,
      "startingPrice": 12000,
      "distanceKm": 2.1,
      "verified": true,
      "isAvailable": true
    }
  ]
}
```

#### API 9.2: Get Filter Metadata
- **Endpoint**: `GET /api/v1/providers/filters-meta`
- **Description**: Retrieves price sliders range and dietary filters for the filter sheet.

---

### Screen 10: Provider Detail Screen
- **File**: [`src/screens/discovery/ProviderDetailScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/discovery/ProviderDetailScreen.tsx)
- **Route**: `ProviderDetail`
- **Total APIs**: **4**

#### API 10.1: Get Provider Profile by ID
- **Endpoint**: `GET /api/v1/providers/:id`
- **Description**: Returns detailed provider profile: about, cover images, portfolio, packages, response time, and contact.
- **Response `200 OK`**: Full `Provider` object.

#### API 10.2: Get Provider Availability Calendar
- **Endpoint**: `GET /api/v1/providers/:id/calendar?year=2026&month=11`
- **Description**: Returns the month status map for dates (`available`, `blocked`, `booked`).
- **Response `200 OK`**:
```json
{
  "providerId": "prov-glam-glow",
  "dates": {
    "2026-11-14": "available",
    "2026-11-15": "available",
    "2026-11-20": "booked",
    "2026-11-25": "blocked"
  }
}
```

#### API 10.3: Update Provider Date Status (Provider Mode)
- **Endpoint**: `PUT /api/v1/providers/:id/calendar/date`
- **Description**: Allows providers to toggle or set a date's availability status.
- **Request Body**:
```json
{
  "date": "2026-11-15",
  "status": "available"
}
```
- **Response `200 OK`**: Status confirmation.

#### API 10.4: Get Provider Reviews
- **Endpoint**: `GET /api/v1/providers/:id/reviews`
- **Description**: Returns verified customer reviews, ratings breakdown, and timestamps.
- **Response `200 OK`**: Array of reviews.

---

### Screen 11: Dish / Package Selection Screen
- **File**: [`src/screens/booking/DishSelectionScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/booking/DishSelectionScreen.tsx)
- **Route**: `DishSelection`
- **Total APIs**: **2**

#### API 11.1: Get Provider Menu Dishes with Photos
- **Endpoint**: `GET /api/v1/providers/:id/menu`
- **Description**: Retrieves menu categorized dishes with photos, pricing, and veg/non-veg tags.
- **Response `200 OK`**:
```json
[
  {
    "category": "Main Course",
    "dishes": [
      {
        "id": "dish-1",
        "name": "Salem Special Thalassery Biryani",
        "price": 240,
        "veg": false,
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800"
      }
    ]
  }
]
```

#### API 11.2: Get Provider Predefined Packages
- **Endpoint**: `GET /api/v1/providers/:id/packages`
- **Description**: Retrieves curated menu bundles with per-person rate and included items.
- **Response `200 OK`**: Array of `MenuPackage` objects.

---

### Screen 12: Enquiry Form Screen
- **File**: [`src/screens/booking/EnquiryFormScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/booking/EnquiryFormScreen.tsx)
- **Route**: `EnquiryForm`
- **Total APIs**: **2**

#### API 12.1: Check Provider Date Availability
- **Endpoint**: `GET /api/v1/providers/:id/availability?startDate=2026-11-15&endDate=2026-11-16`
- **Description**: Validates that all requested dates are open before enquiry submission.
- **Response `200 OK`**:
```json
{
  "isAvailable": true,
  "blockedDates": []
}
```

#### API 12.2: Submit Event Enquiry
- **Endpoint**: `POST /api/v1/enquiries`
- **Description**: Creates and dispatches customer enquiry to the provider. Supports From/To date range and makeup simultaneous styling staffing flags.
- **Request Body**:
```json
{
  "providerId": "prov-glam-glow",
  "category": "makeup",
  "eventType": "Bridal (Muhurtham)",
  "eventDate": "2026-11-15",
  "eventEndDate": "2026-11-16",
  "location": "Fairlands, Salem",
  "guestCount": 2,
  "makeupPersonsCount": 2,
  "simultaneousStyling": true,
  "backupArtistAssigned": true,
  "items": [
    { "name": "HD Bridal Makeup", "price": 12000, "qty": 1 },
    { "name": "Bridesmaid Styling", "price": 4000, "qty": 1 }
  ],
  "notes": "1 Lead Artist + 1 Backup Artist required for simultaneous ready time at 6:00 AM."
}
```
- **Response `201 Created`**:
```json
{
  "id": "enq-2001",
  "status": "submitted",
  "createdAt": "2026-10-25"
}
```

---

### Screen 13: Enquiry Success Screen
- **File**: [`src/screens/booking/EnquirySuccessScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/booking/EnquirySuccessScreen.tsx)
- **Route**: `EnquirySuccess`
- **Total APIs**: **1**

#### API 13.1: Get Created Enquiry Status
- **Endpoint**: `GET /api/v1/enquiries/:id`
- **Description**: Fetches confirmation summary and provider expected response window.
- **Response `200 OK`**: Single `Enquiry` object.

---

### Screen 14: Enquiries List Screen
- **File**: [`src/screens/booking/EnquiriesListScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/booking/EnquiriesListScreen.tsx)
- **Route**: `MainTabs -> Enquiries`
- **Total APIs**: **1**

#### API 14.1: List Customer Enquiries
- **Endpoint**: `GET /api/v1/enquiries`
- **Description**: Retrieves all submitted enquiries with live status badges (`submitted`, `provider_responded`, `accepted`, `quote_sent`, etc.).
- **Response `200 OK`**:
```json
[
  {
    "id": "enq-2001",
    "providerName": "Glow & Glamour Bridal Studio",
    "category": "makeup",
    "status": "provider_responded",
    "eventDate": "2026-11-15",
    "estimatedTotal": 16000
  }
]
```

---

### Screen 15: Enquiry Detail Screen
- **File**: [`src/screens/booking/EnquiryDetailScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/booking/EnquiryDetailScreen.tsx)
- **Route**: `EnquiryDetail`
- **Total APIs**: **2**

#### API 15.1: Get Enquiry Full Details
- **Endpoint**: `GET /api/v1/enquiries/:id` (Reusable)
- **Description**: Retrieves full itemization, provider quotes, messages, and staffing allocation.

#### API 15.2: Update Enquiry Status (Customer Action)
- **Endpoint**: `PATCH /api/v1/enquiries/:id/status`
- **Description**: Customer accepts quote, marks confirmed, or cancels enquiry.
- **Request Body**:
```json
{
  "status": "confirmed",
  "reason": "Quote accepted"
}
```
- **Response `200 OK`**: Updated enquiry.

---

### Screen 16: Rating & Review Screen
- **File**: [`src/screens/booking/RatingReviewScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/booking/RatingReviewScreen.tsx)
- **Route**: `RatingReview`
- **Total APIs**: **2**

#### API 16.1: Get Completed Enquiry for Review Eligibility
- **Endpoint**: `GET /api/v1/enquiries/:id` (Reusable)
- **Description**: Validates that enquiry is completed and review is allowed.

#### API 16.2: Submit Provider Review
- **Endpoint**: `POST /api/v1/reviews`
- **Description**: Submits stars rating, feedback comment, and optional photos.
- **Request Body**:
```json
{
  "enquiryId": "enq-2001",
  "providerId": "prov-glam-glow",
  "rating": 5,
  "comment": "Exceptional service! Both bride and sister were styled on time with the backup artist.",
  "photos": []
}
```
- **Response `201 Created`**: Review confirmation.

---

### Screen 17: Notifications Screen
- **File**: [`src/screens/home/NotificationsScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/home/NotificationsScreen.tsx)
- **Route**: `Notifications`
- **Total APIs**: **3**

#### API 17.1: Fetch In-App Notifications
- **Endpoint**: `GET /api/v1/notifications`
- **Description**: Retrieves alerts for new quotes, provider replies, and booking confirmations.
- **Response `200 OK`**:
```json
[
  {
    "id": "notif-1",
    "title": "Quote Received!",
    "message": "Glow & Glamour Bridal Studio sent a quote for ₹16,000",
    "time": "10 mins ago",
    "read": false,
    "type": "enquiry"
  }
]
```

#### API 17.2: Mark Notification as Read
- **Endpoint**: `PATCH /api/v1/notifications/:id/read`
- **Description**: Sets `read: true` for a single notification.
- **Response `200 OK`**: Success status.

#### API 17.3: Mark All Notifications Read
- **Endpoint**: `PATCH /api/v1/notifications/mark-all-read`
- **Description**: Marks all notifications as read.
- **Response `200 OK`**: Success status.

---

### Screen 18: Profile Screen
- **File**: [`src/screens/profile/ProfileScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/profile/ProfileScreen.tsx)
- **Route**: `MainTabs -> Profile`
- **Total APIs**: **2**

#### API 18.1: Get Customer Profile
- **Endpoint**: `GET /api/v1/user/profile`
- **Description**: Loads user contact info, district, locality, and statistics.
- **Response `200 OK`**: `CustomerProfile` object.

#### API 18.2: User Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Description**: Invalidates session token on server.
- **Response `200 OK`**:
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### Screen 19: Edit Profile Screen
- **File**: [`src/screens/profile/EditProfileScreen.tsx`](file:///d:/downloads/AagaraThirupthi/AagaraThirupthi/src/screens/profile/EditProfileScreen.tsx)
- **Route**: `EditProfile`
- **Total APIs**: **1**

#### API 19.1: Update Customer Profile
- **Endpoint**: `PUT /api/v1/user/profile`
- **Description**: Updates user full name, WhatsApp number, alternate mobile, and Salem address.
- **Request Body**:
```json
{
  "name": "Kavitha Rajan",
  "whatsapp": "9876543210",
  "altMobile": "9443322110",
  "district": "Salem",
  "location": "Fairlands"
}
```
- **Response `200 OK`**: Updated profile object.

---

## 4. Master REST API Catalog (Unique 25 Endpoints)

| # | HTTP Method | Endpoint URL | Description | Auth Required |
| :-: | :---: | :--- | :--- | :---: |
| **1** | `GET` | `/api/v1/app/onboarding` | Fetch dynamic onboarding slides | No |
| **2** | `POST` | `/api/v1/auth/send-otp` | Request 6-digit SMS OTP | No |
| **3** | `POST` | `/api/v1/auth/verify-otp` | Verify OTP & receive JWT token | No |
| **4** | `POST` | `/api/v1/auth/resend-otp` | Resend OTP | No |
| **5** | `POST` | `/api/v1/auth/logout` | Invalidate JWT session | Yes |
| **6** | `GET` | `/api/v1/user/profile` | Get logged-in user profile | Yes |
| **7** | `PUT` | `/api/v1/user/profile` | Update user profile | Yes |
| **8** | `PATCH` | `/api/v1/user/location` | Update user GPS or manual locality | Yes |
| **9** | `GET` | `/api/v1/categories` | List active service categories | No |
| **10** | `GET` | `/api/v1/categories/details` | Detailed category catalog | No |
| **11** | `GET` | `/api/v1/districts` | List Tamil Nadu districts & Salem localities | No |
| **12** | `GET` | `/api/v1/config/event-types` | Event types & services by category | No |
| **13** | `POST` | `/api/v1/requirements/draft` | Validate & store event requirement draft | Yes |
| **14** | `GET` | `/api/v1/combos/special` | List curated special combos | No |
| **15** | `POST` | `/api/v1/combos/special` | Create/publish special combo package | Yes |
| **16** | `GET` | `/api/v1/providers` | Provider directory with search/filters | No |
| **17** | `GET` | `/api/v1/providers/nearby` | Nearby providers sorted by GPS distance | No |
| **18** | `POST` | `/api/v1/providers/match` | Filter & rank providers by requirement | Yes |
| **19** | `GET` | `/api/v1/providers/:id` | Full provider profile, contact & details | No |
| **20** | `GET` | `/api/v1/providers/:id/calendar` | Month availability calendar map | No |
| **21** | `PUT` | `/api/v1/providers/:id/calendar/date` | Manage/toggle date availability | Yes |
| **22** | `GET` | `/api/v1/providers/:id/menu` | Provider dishes with photos & packages | No |
| **23** | `POST` | `/api/v1/enquiries` | Submit event enquiry | Yes |
| **24** | `GET` | `/api/v1/enquiries` | List customer enquiries | Yes |
| **25** | `GET` | `/api/v1/enquiries/:id` | Get single enquiry details | Yes |
| **26** | `PATCH` | `/api/v1/enquiries/:id/status` | Update enquiry status (accept/cancel) | Yes |
| **27** | `GET` | `/api/v1/enquiries/summary` | Active enquiry count & pending badges | Yes |
| **28** | `POST` | `/api/v1/reviews` | Submit rating & review for provider | Yes |
| **29** | `GET` | `/api/v1/notifications` | Fetch user notification feed | Yes |
| **30** | `PATCH` | `/api/v1/notifications/:id/read` | Mark single notification as read | Yes |
| **31** | `PATCH` | `/api/v1/notifications/mark-all-read` | Mark all notifications as read | Yes |
| **32** | `GET` | `/api/v1/notifications/unread-count` | Unread notification count | Yes |

*(Note: Grouped into **25 Core Resource Endpoints** with sub-actions)*

---

## 5. Security & Technical Standards

1. **Authentication**: All protected endpoints require `Authorization: Bearer <JWT_TOKEN>` header.
2. **Error Format**:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed: eventEndDate must be equal or later than eventDate",
  "errors": []
}
```
3. **Date Standards**: ISO 8601 strings (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`).
4. **Geolocation**: Latitude and Longitude floats with 4 decimal places accuracy.

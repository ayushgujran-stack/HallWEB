# VenueLuxe Marketplace Platform — Feature & Architectural Documentation

## Executive Overview
The **VenueLuxe Marketplace Platform** (`stitch_venuecraft_marketplace_platform`) is an end-to-end, multi-portal web application engineered specifically for discovering, booking, and managing luxury wedding palaces, banquet halls, and convention centers across coastal and South Canara regions (e.g., Karkala, Mangalore, Udupi, Manipal). 

The platform is constructed as a modern modular web application powered by a unified reactive data store (`js/store.js`), dedicated single-page applications for three distinct user portals, transparent multi-shift booking engines, and administrative verification workflows.

---

## 1. Core Architecture & Multi-Portal Design

```
                     ┌──────────────────────────────────────────────┐
                     │           Central Reactive Store             │
                     │       (shared/js/store.js - LocalStorage)    │
                     └──────────────────────┬───────────────────────┘
                                            │
            ┌───────────────────────────────┼───────────────────────────────┐
            ▼                               ▼                               ▼
 ┌──────────────────────┐        ┌──────────────────────┐        ┌──────────────────────┐
 │   Customer Website   │        │  Hall Owner Website  │        │ Super Admin Website  │
 │ customer/index.html  │        │   owner/index.html   │        │   admin/index.html   │
 │ (customer/js/...)    │        │   (owner/js/...)     │        │   (admin/js/...)     │
 └──────────────────────┘        └──────────────────────┘        └──────────────────────┘
```

### Key Architectural Foundations
- **Dedicated Website Directories**: Each website is organized into its own dedicated folder (`customer/`, `owner/`, `admin/`) containing dedicated HTML, CSS stylesheets, components, views, routers, and application bootstraps.
- **Direct Entry Points**: The Customer Website serves as the primary storefront (`/customer/` and `/`), while the Hall Owner Workspace (`/owner/`) and Super Admin Dashboard (`/admin/`) operate as specialized portals for venue operators and platform administrators.
- **Shared Data & UI Core (`shared/`)**: Contains shared design tokens and typography (`shared/css/base.css`), centralized reactive LocalStorage state manager (`shared/js/store.js`), global config (`shared/js/config.js`), toast engine (`shared/js/notification.js`), booking/wizard modals (`shared/js/modals.js`), and luxury footer (`shared/js/footer.js`). Custom browser events (`hallsUpdated`, `bookingsUpdated`, `slotMatrixUpdated`, `notificationsUpdated`) ensure real-time cross-portal data synchronization.

---

## 2. Shared Data Models & Storage Schema

The central store initializes pre-seeded luxury venues, bookings, reviews, and audit logs. The schema includes:

### A. Halls (`STORAGE_KEYS.HALLS`)
- **Identification**: `id`, `slug`, `name`, `owner_id`.
- **Dimensions & Specs**: `size_sqft`, `length_ft`, `width_ft`, `ceiling_height_ft`, `seating_capacity`, `maximum_capacity`, `stage_dimensions`, `green_rooms`, `elevators`.
- **Climate & Facilities**: `ac_status` (e.g. Central VRF AC, Non-AC), `indoor_outdoor`, `parking_cars`, `dining_seats`, `has_valet`, `has_kitchen`, `has_generator`, `generator_kva`.
- **Pricing Breakdown**: Shift-level pricing (`morning`, `afternoon`, `evening`, `night`, `full_day`).
- **Certification & Status**: `status` (`LIVE`, `PENDING_APPROVAL`, `DRAFT`, `SUSPENDED`, `REJECTED`), `verification_badge`.
- **Privacy Controls**: `privacy_settings` (`show_availability`, `show_phone`, `show_whatsapp`, `show_email`).

### B. Shift Availability Matrix (`venueluxe_slot_matrix`)
Tracks shift availability per date across five defined time windows:
1. **Morning**: 7:00 AM – 2:00 PM
2. **Afternoon**: 12:00 PM – 4:00 PM
3. **Evening**: 4:00 PM – 11:00 PM
4. **Night**: 7:00 PM – 1:00 AM
5. **Full Day**: 24-Hour Exclusive Access

Shift states include `available`, `pending`, `booked`, and `blocked`.

### C. Bookings (`STORAGE_KEYS.BOOKINGS`)
- `id` (e.g. `BK-78901`), `hall_id`, `customer_id`, `event_type`, `date`, `slot`, `guests`, `notes`, `amount`, `status` (`PENDING`, `ACCEPTED`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`).

---

## 3. Customer Marketplace Portal (`index.html`)

The Customer Portal provides event planners and wedding families with an intuitive venue discovery and direct holding experience.

### Key Features:
1. **Hero Discovery Console**:
   - Search by Location/City (e.g. Karkala, Mangalore, Udupi), Event Occasion (Wedding, Birthday, Corporate, Cultural), and Event Date.
   - Quick-select location chips for fast filtering.
2. **Multi-Parameter Search & Discovery (`js/views/search.js`)**:
   - Real-time client-side filter engine matching AC status, guest capacity sliders, price per shift ranges, car parking thresholds, and venue types.
   - Dual view layout: Grid layout with venue cards and interactive location view with distance metrics.
   - Verified luxury badges and dynamic rating previews.
3. **Venue Details & Gallery View (`js/views/details.js`)**:
   - Comprehensive floorplan specifications (ceiling clearance, hall dimensions, green rooms, generator backup kVA).
   - Dynamic high-resolution image modal gallery.
   - Direct owner contact cards with WhatsApp integration.
4. **Shift Availability Matrix & Hold Engine**:
   - Displays real-time availability calendar across all 5 shift slots for selected dates.
   - Clear pricing per shift with instant hold request modal.
   - Requests start in `PENDING` status to prevent unauthorized double-booking.
5. **Review & Rating System**:
   - Post 5-star reviews with verified customer badges.
   - Automatically recalculates venue average rating and review counts on submission.
6. **Favorites & Wishlist**:
   - One-click heart toggle that persists across sessions and updates the header counter badge.

---

## 4. Hall Owner Workspace (`owner.html`)

The Owner Workspace equips hall managers with full operational command over their venue listings, shift calendars, and incoming reservations.

### Key Features:
1. **Property Portfolio Dashboard (`js/views/ownerDashboard.js`)**:
   - Comprehensive overview of owner's listed venues, active booking requests, total revenue, and occupancy metrics.
   - Listing status indicators (`LIVE`, `PENDING_APPROVAL`, `SUSPENDED`).
2. **Venue Creation & Listing Engine (`js/components/modals.js`)**:
   - Multi-field venue submission wizard capturing hall dimensions, seating capacity, AC specifications, parking slots, green suites, and shift pricing schedules.
   - **Verification Safety Rule**: All new owner venue submissions automatically enter `PENDING_APPROVAL` status and remain hidden from public customer search until certified by Super Admin.
3. **Booking Request Management**:
   - Actionable list of incoming customer booking requests with date, guest count, and event notes.
   - One-click **Accept** or **Reject** controls that dispatch instant notifications to the customer.
4. **Shift Calendar & Inventory Manager**:
   - Manual override control for venue dates and shifts.
   - Ability to mark shifts as `Available`, `Booked`, or `Blocked` (for private maintenance or off-platform bookings).
5. **Venue Privacy & Contact Controls**:
   - Toggle switches for showing/hiding direct phone numbers, WhatsApp links, email addresses, and public calendar availability.

---

## 5. Super Admin Dashboard (`admin.html`)

The Super Admin Dashboard serves as the central control tower for platform integrity, venue certification, and user moderation.

### Key Features:
1. **Venue Certification & Approval Queue (`js/views/adminDashboard.js`)**:
   - Dedicated review tab for pending hall submissions.
   - Detailed inspection panel for floor specs, owner identity, and facility claims.
   - One-click **Approve & Grant Verified Badge** (changes status to `LIVE`) or **Reject with Reason**.
2. **Platform Audit Logging System (`STORAGE_KEYS.AUDIT_LOGS`)**:
   - System log recording critical administrative events (e.g. venue approvals, rejections, manual suspensions, report resolutions).
   - Timestamped records including admin name, affected venue, action type, and rationale.
3. **Report Moderation & Dispute Handling (`STORAGE_KEYS.REPORTS`)**:
   - Flagged venue management queue for user-submitted discrepancies (e.g. parking overstatements, inaccurate pricing).
   - Tools to review, flag, suspend, or resolve reported venues with action notes.
4. **Global Platform Metrics**:
   - Real-time performance indicators: Total Venues, Active Live Listings, Pending Verification Queue Count, and Total Booking Volume.
   - Global venue management list with full suspend/restore capabilities.

---

## 6. Design System & UI Principles

- **Visual Palette**: Premium luxury aesthetic utilizing Deep Midnight Navy (`#0F172A`), Warm Champagne Gold (`#B45309`), Verified Emerald (`#009668`), and crisp ivory slate surface layers (`css/custom.css`).
- **Typography**: Dual font architecture pairing classical *Playfair Display* serif headings for luxury grandeur with *Plus Jakarta Sans* for readable data tables, filter chips, and forms.
- **Interactive Feedback**: Floating notification toast system (`js/components/notification.js`), smooth modal transitions (`js/components/modals.js`), and responsive status badges.

---

## Summary of Main App Entry Points

| Website Directory | Entry File | App Controller | Target Audience | Primary Functionality |
| :--- | :--- | :--- | :--- | :--- |
| **Customer Website** | [`customer/index.html`](file:///Users/ayushrajeshpoojary/PROJECTS/hall%20booking%20/THE%20Website/stitch_venuecraft_marketplace_platform/customer/index.html) | `customer/js/customerApp.js` | Event Planners / Customers | Hero search, venue discovery, shift availability holding, reviews, favorites. Default website at `/` and `/customer/`. |
| **Hall Owner Website** | [`owner/index.html`](file:///Users/ayushrajeshpoojary/PROJECTS/hall%20booking%20/THE%20Website/stitch_venuecraft_marketplace_platform/owner/index.html) | `owner/js/ownerApp.js` | Banquet & Hall Owners | Listing creation wizard, booking request management, shift matrix controls, privacy settings. Accessible at `/owner/`. |
| **Super Admin Website** | [`admin/index.html`](file:///Users/ayushrajeshpoojary/PROJECTS/hall%20booking%20/THE%20Website/stitch_venuecraft_marketplace_platform/admin/index.html) | `admin/js/adminApp.js` | Super Admin Authority | Listing verification & certification, audit logging, report moderation, global venue controls. Accessible at `/admin/`. |
| **Shared Assets** | [`shared/`](file:///Users/ayushrajeshpoojary/PROJECTS/hall%20booking%20/THE%20Website/stitch_venuecraft_marketplace_platform/shared/) | `store.js`, `modals.js` | Cross-Portal Core | Base styling tokens, LocalStorage state store, notifications, and interactive modals. |

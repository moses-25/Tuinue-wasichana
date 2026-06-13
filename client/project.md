# Tuinue Wasichana — Project Summary

## What Is This Project?

**Tuinue Wasichana** (Swahili for "Empower Girls") is a web platform that connects donors, charities, and communities to support girls' education in Kenya. Donors can discover and fund vetted charities, charities can manage their campaigns and track donations, and admins oversee the entire platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Routing | React Router DOM v7 |
| HTTP Client | Axios + native Fetch |
| Icons | React Icons (Feather set) |
| Styling | CSS Modules (per-component CSS files) |
| Auth State | React Context API (`AuthContext`) |
| Build Tool | Vite 7 |

---

## User Roles

The platform has three distinct user roles, each with their own dashboard and permissions:

1. **Donor** — registers, browses charities, makes donations (one-time or recurring), views donation history.
2. **Charity (Organization)** — applies to join the platform, manages their charity profile, views incoming donations and donor analytics.
3. **Admin** — approves/rejects charity applications, manages all users, charities, and donations platform-wide.

---

## Application Routes

| Path | Component | Who Uses It |
|---|---|---|
| `/` | Login | Everyone (entry point) |
| `/reg` | Register | New users |
| `/home` | HomePage | All authenticated users |
| `/Charity` | Charities | Public / Donors |
| `/donate` | DonationPage | Donors |
| `/don` | Donations (list) | Donors |
| `/stories` | Stories | Public |
| `/donor` | DonorDashboard | Donors |
| `/org` | CharityDashboard | Charity orgs |
| `/admin` | AdminDashboard | Admins only |
| `/apply-charity` | ApplyCharity | Donors applying to become a charity |
| `/profile` | Profile | Authenticated users |
| `/contact` | Contact | Everyone |

---

## Project Structure

```
src/
├── App.jsx                        # Root component, all routes defined here
├── main.jsx                       # React entry point
├── contexts/
│   └── AuthContext.jsx            # Global auth state (login, register, logout, user role)
├── services/
│   ├── api.js                     # All API calls (auth, charities, donations, stories)
│   └── axiosInstance.js           # Axios instance (base URL + auth headers)
├── features/
│   └── auth/
│       ├── Login2.jsx             # Login form
│       └── Register.jsx           # Registration form (donor / charity / admin)
├── Pages/
│   ├── HomePage.jsx               # Landing page with hero, charities, stories, FAQ
│   ├── Charities.jsx              # Browse all approved charities
│   ├── Donate.jsx                 # Full donation flow (amount, charity, payment method)
│   ├── Donations.jsx              # Donor's donation history list
│   ├── Stories.jsx                # Success stories page
│   ├── ApplyCharity.jsx           # Form for donors to apply as a charity
│   ├── Profile.jsx                # User profile view/edit
│   ├── Contact.jsx                # Contact form
│   ├── Admin/
│   │   └── AdminDashboard.jsx     # Admin panel (users, charities, applications, donations)
│   └── Dashboards/
│       ├── DonorDashboard.jsx     # Donor stats, donation history, charity browsing
│       └── CharityDashboard.jsx   # Charity stats, donor list, analytics
└── components/
    ├── Navbar.jsx / Footer.jsx    # Shared layout
    ├── HeroSection.jsx            # Landing hero with stats
    ├── CharityCard.jsx            # Charity display card
    ├── StoryCard.jsx              # Success story card
    ├── ProgramCard.jsx            # Program/initiative card
    ├── FAQItem.jsx                # Expandable FAQ entry
    ├── ImpactNote.jsx             # Highlight/impact callout
    ├── StatsGrid.jsx              # Admin stats overview grid
    ├── CharityStats.jsx           # Charity-specific stats
    ├── AnalyticsPanel.jsx         # Charts/analytics for charity dashboard
    ├── CharityTabs.jsx            # Tab navigation for charity dashboard
    ├── CharityList.jsx            # List of charities (dashboard view)
    ├── DonationList.jsx           # List of donations (dashboard view)
    ├── UsersTable.jsx             # Admin: users table
    ├── CharitiesTable.jsx         # Admin: charities table
    ├── DonationsTable.jsx         # Admin: donations table
    ├── RecentActivities.jsx       # Admin: recent activity feed
    ├── QuickActions.jsx           # Admin: shortcut action buttons
    ├── CharityFormModal.jsx       # Modal for adding/editing a charity
    ├── SettingsModal.jsx          # Admin settings modal
    └── BackendTest.jsx            # Dev utility to test backend connectivity
```

---

## Authentication Flow

1. User registers via `/reg` — role is set at registration (donor / charity / admin).
2. On login, the backend returns a JWT token + user object.
3. Token is stored in `localStorage` (`authToken`, `userRole`, `userData`).
4. `AuthContext` wraps the entire app and exposes `user`, `isAuthenticated`, `login`, `register`, `logout`.
5. On app load, stored token is validated against the backend; if the backend is unavailable, the stored session is kept alive.
6. Role-based routing: each dashboard checks `user.role` and redirects unauthorized users to `/`.

---

## API Layer (`src/services/api.js`)

All backend communication goes through `api.js`. Base URL is `/api/v1`.

| Module | Key Endpoints |
|---|---|
| `authAPI` | `POST /auth/login`, `POST /auth/register`, `GET /auth/profile` |
| `charityAPI` | `GET /charities/`, `POST /charities/apply`, `GET /charities/applications`, approve/reject/delete |
| `donationAPI` | `POST /donations/`, `GET /donations/history`, M-Pesa initiate & status check |
| `storiesAPI` | `GET /stories/`, `POST /stories/`, `GET /stories/charity/:id` |
| `healthAPI` | `GET /health` |

Auth headers (`Bearer <token>`) are automatically attached to all protected requests.

---

## Donation Flow

1. Donor navigates to `/donate`.
2. Selects a charity (or arrives with `?charity=<id>` pre-selected from URL).
3. Chooses donation type: **one-time** or **recurring**.
4. Picks an amount ($10 / $25 / $50 / $100 / custom).
5. Selects payment method: **Visa**, **M-Pesa**, or **PayPal**.
6. Fills in personal/payment details.
7. Optionally donates **anonymously**.
8. Submits — calls `donationAPI.makeDonation()` or `donationAPI.initiateMpesaPayment()`.

---

## Key Features Per Dashboard

### Donor Dashboard (`/donor`)
- Overview stats: total donated, charities supported, donation streak, impact score
- Tabs: Overview, Donation History, Supported Charities, Achievements
- Fetches real donation history from backend

### Charity Dashboard (`/org`)
- Stats: total raised, donor count, active campaigns
- Tabs: My Charities, Donations Received, Analytics
- Add/edit charity via modal (`CharityFormModal`)
- Analytics panel with donation trends

### Admin Dashboard (`/admin`)
- Stats grid: total users, charities, donations, platform health
- Tabs: Overview, Users, Charities, Donations, Applications
- Approve / reject charity applications
- Delete charities
- Recent activity feed + quick action shortcuts
- Settings modal

---

## Payment Methods Supported

- **Visa / Credit Card** — card number, expiry, CVV
- **M-Pesa** — phone number, STK push via backend
- **PayPal** — redirects to PayPal flow

Payment logos are stored in `src/assets/images/` (visa.svg, mpesa.svg, paypal.svg).

---

## Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

---

## Backend Integration Status

| Feature | Status |
|---|---|
| Login / Register | Integrated |
| Fetch charities | Integrated |
| Donation submission | Integrated |
| M-Pesa payment | Integrated |
| Donation history | Integrated |
| Charity applications (admin) | Integrated |
| Approve/reject charity | Integrated |
| User management (admin) | Mock data (needs backend) |
| Stories | API ready, backend may vary |
| Profile update | UI ready, needs backend endpoint |

---

## Notes for the Team

- The app entry point is `/` which renders the **Login** page. After login, users are redirected based on their role.
- Role-based access is enforced on the frontend — always enforce it on the backend too.
- If the backend is down, users stay logged in using cached `localStorage` data.
- All CSS is co-located with its component/page (no global stylesheet except per-component files).
- `BackendTest.jsx` is a dev utility — remove or gate it before production.
- M-Pesa integration requires the backend to have Safaricom Daraja API credentials configured.

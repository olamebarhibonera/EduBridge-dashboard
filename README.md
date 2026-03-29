# EduBridge Admin Dashboard

> A professional admin panel built with React, Vite, and shadcn/ui to manage the EduBridge mobile platform.

![Dashboard Overview](docs/screenshots/dashboard-overview.png)

---

## Overview

EduBridge Dashboard is a modern web admin panel that provides complete management capabilities for the EduBridge mobile app. Built with **React + Vite**, **shadcn/ui**, and **Supabase**, it enables administrators to manage users, translations, services, announcements, and generate PDF reports.

**Created by:** OLAME BARHIBONERA Eben  
**Project Type:** Final Year Project (2025/2026)

---

## Screenshots

| Dashboard | User Management | Landing Page |
|:---------:|:---------------:|:------------:|
| ![Dashboard](docs/screenshots/dashboard-overview.png) | ![Users](docs/screenshots/dashboard-users.png) | ![Landing](docs/screenshots/landing-page.png) |

---

## Features

### Product Landing Page (`/welcome`)

- Animated single-page product landing page introducing EduBridge
- Smooth scroll animations with framer-motion (motion)
- Hero section with gradient text and floating stat cards
- Feature showcase for mobile app and admin dashboard
- Architecture diagram showing the platform structure
- About the creator section with contact links
- Call-to-action leading to the admin login
- Responsive design for all screen sizes

### Admin Dashboard

- **Dashboard Overview** — Real-time stats (users, translations, services, transactions), recent activity feed, and platform health indicators
- **User Management (Full CRUD)** — Create, view, edit, and delete user profiles. Change roles (Student, Moderator, Admin), activate/suspend accounts, with confirmation dialogs and activity logging
- **Translation Management** — Manage verified translation phrases, review/approve translations, filter by language and category
- **Services Management** — CRUD for local services (hospitals, banks, restaurants, etc.) with category management and active/inactive toggleing
- **Announcements** — Create and manage announcements with priority levels (urgent, high, normal, low) and target audience filtering
- **Reports & PDF Export** — Generate reports on users, translations, transactions, and services. Export any report as a professionally formatted PDF using jsPDF
- **Settings** — Platform configuration and app settings management
- **Activity Log** — Full audit trail of all admin actions

### Authentication & Authorization

- Supabase authentication with admin-only access control
- Profile-based role checking on login
- Persistent sessions with auto-refresh
- Secure sign-out with session cleanup

### UI/UX

- **shadcn/ui Components** — Professional, accessible, and themeable UI components
- **Collapsible Sidebar** — Navigation with icons, labels, and user info
- **Breadcrumb Navigation** — Contextual breadcrumbs in the header
- **Loading States** — Skeleton animations for all data-loading states
- **Responsive Design** — Works on desktop and tablet
- **Purple Brand Identity** — Consistent `#8b5cf6` primary color matching the mobile app

---

## Tech Stack

| Technology | Purpose |
|:-----------|:--------|
| React 18 | UI framework |
| Vite 6 | Build tooling and dev server |
| TypeScript | Type-safe development |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | UI component library (Radix primitives) |
| Supabase | Authentication + PostgreSQL database |
| Drizzle ORM | Type-safe schema definitions |
| React Router 7 | Client-side routing |
| framer-motion (motion) | Animations (landing page) |
| jsPDF + jspdf-autotable | PDF report generation |
| Lucide React | Icon library |
| Recharts | Dashboard charts |

---

## Project Structure

```
EduBridge-dashboard/
├── package.json
├── vite.config.ts
├── drizzle.config.ts                # Drizzle ORM configuration
├── .env                             # Environment variables
├── docs/
│   └── screenshots/                 # Dashboard screenshots
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Full database schema + RLS policies
└── src/
    ├── main.tsx                     # App entry point
    ├── styles/
    │   ├── index.css                # CSS imports
    │   ├── tailwind.css             # Tailwind base
    │   ├── theme.css                # CSS variables (colors, radius)
    │   ├── themes.css               # Theme variants
    │   └── animations.css           # Animation keyframes & utilities
    ├── navigation/
    │   └── routes.ts                # React Router configuration
    ├── db/
    │   └── schema.ts                # Drizzle ORM table definitions
    ├── lib/
    │   ├── supabase.ts              # Supabase client initialization
    │   ├── utils.ts                 # Utility functions (cn, formatDate, etc.)
    │   └── pdf-export.ts            # PDF generation functions
    ├── contexts/
    │   └── AuthContext.tsx           # Authentication context + profile fetching
    ├── components/
    │   ├── layout/
    │   │   ├── AdminLayout.tsx       # Main layout (sidebar + header + content)
    │   │   └── AdminSidebar.tsx      # Collapsible sidebar navigation
    │   └── ui/                       # shadcn/ui components
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── dialog.tsx
    │       ├── alert-dialog.tsx
    │       ├── table.tsx
    │       ├── input.tsx
    │       ├── select.tsx
    │       ├── badge.tsx
    │       ├── avatar.tsx
    │       ├── sidebar.tsx
    │       └── ...                   # 30+ shadcn components
    └── pages/
        ├── WelcomePage.tsx           # Animated product landing page
        ├── LoginPage.tsx             # Admin login
        ├── DashboardPage.tsx         # Overview with stats
        ├── UsersPage.tsx             # Full CRUD user management
        ├── TranslationsPage.tsx      # Translation management
        ├── ServicesPage.tsx          # Services directory management
        ├── AnnouncementsPage.tsx     # Announcement management
        ├── ReportsPage.tsx           # Reports with PDF export
        └── SettingsPage.tsx          # Platform settings
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm, yarn, or pnpm
- A Supabase project (shared with the mobile app)

### Installation

```bash
# Navigate to the dashboard project
cd "EduBridge-dashboard"

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase (for Drizzle ORM direct database access)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-1-us-east-1.pooler.supabase.com:6543/postgres

# Supabase (for frontend client)
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

The database schema is defined in `supabase/migrations/001_initial_schema.sql`. To apply it:

**Option 1 — Via Supabase Dashboard:**
Copy the SQL from `001_initial_schema.sql` and run it in the Supabase SQL Editor.

**Option 2 — Via Drizzle Kit:**
```bash
npx drizzle-kit push
```

**Option 3 — Direct migration script:**
```bash
node run-migration.mjs
```

---

## Database Schema

All tables are defined in both SQL (`supabase/migrations/001_initial_schema.sql`) and TypeScript (`src/db/schema.ts`).

### Tables

| Table | Description | Key Fields |
|:------|:------------|:-----------|
| `profiles` | User profiles linked to Supabase Auth | id, full_name, email, university, course, role, status |
| `translations` | Verified translation phrases | source_language, target_language, source_text, translated_text, is_verified |
| `services` | Local services directory | name, category, address, phone, latitude, longitude |
| `transactions` | Financial records (budget) | user_id, amount, type, category, date |
| `announcements` | Admin announcements | title, content, priority, target_audience, is_active |
| `app_settings` | Platform configuration | key, value (JSONB) |
| `activity_log` | Admin action audit trail | user_id, action, entity_type, metadata |

### Row Level Security (RLS)

All tables have RLS enabled:
- **Students** can only read their own profiles and public data
- **Admins** have full access via the `is_admin()` helper function
- Profile creation is handled by a database trigger on `auth.users` signup

---

## Routes

| Path | Page | Description |
|:-----|:-----|:------------|
| `/welcome` | WelcomePage | Product landing page (public) |
| `/login` | LoginPage | Admin authentication |
| `/` | DashboardPage | Overview with stats and activity |
| `/users` | UsersPage | User management (CRUD) |
| `/translations` | TranslationsPage | Translation management |
| `/services` | ServicesPage | Services directory |
| `/announcements` | AnnouncementsPage | Announcement management |
| `/reports` | ReportsPage | Reports with PDF export |
| `/settings` | SettingsPage | Platform configuration |

---

## PDF Export

The dashboard supports PDF export for:

- **User Reports** — Full user list with roles, status, university
- **Translation Reports** — Verified phrases by language pair
- **Transaction Reports** — Financial summaries by user/category
- **Service Reports** — Service directory listing

All PDFs are generated client-side using `jsPDF` and `jspdf-autotable`.

---

## Design System

### Brand Colors

| Token | Light Mode | Purpose |
|:------|:-----------|:--------|
| `--primary` | `#8b5cf6` | Primary purple (matches mobile) |
| `--background` | `#ffffff` | Page background |
| `--card` | `#ffffff` | Card surfaces |
| `--destructive` | `#d4183d` | Error/delete actions |
| `--muted` | `#ececf0` | Muted backgrounds |

### Animation Classes

Available CSS classes from `animations.css`:

- `animate-fade-in-up` / `animate-fade-in-down` — Entrance animations
- `animate-scale-in` — Scale entrance
- `animate-float` — Floating effect
- `animate-glow` — Purple glow pulse
- `hover-lift` / `hover-scale` — Hover interactions
- `glass` / `glass-dark` — Glassmorphism effects
- `luxury-gradient-bg` / `luxury-gradient-text` — Gradient styles
- `animation-delay-100` through `animation-delay-600` — Stagger delays

---

## Related Projects

- **[EduBridge Mobile](../EduBridge%20mobile/)** — React Native mobile app for students

---

## Scripts

| Script | Description |
|:-------|:------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run migrations |

---

## License

This project is part of a final year academic submission.

**&copy; 2025-2026 OLAME BARHIBONERA Eben**

# UnitKeep: Condo Management Portal

A web-based condominium management system built with **Laravel 12**, **React 19**, **Inertia.js**, and **Tailwind CSS 4**. UnitKeep enables administrators to manage tenants, units, leases, billing, and maintenance requests through a role-based portal.

---

## Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Backend   | PHP 8.2+, Laravel 12, Fortify (Auth)   |
| Frontend  | React 19, TypeScript, Inertia.js       |
| Styling   | Tailwind CSS 4, Radix UI, shadcn/ui    |
| Database  | SQLite (local dev)                     |
| Build     | Vite 7                                 |
| Testing   | Pest (PHP)                             |

---

## Prerequisites

Make sure you have the following installed on your machine:

- **PHP 8.2+** with the `sqlite3`, `mbstring`, `xml`, and `curl` extensions
- **Composer** (PHP dependency manager) — [https://getcomposer.org](https://getcomposer.org)
- **Node.js 20+** and **npm** — [https://nodejs.org](https://nodejs.org)
- **Git** — [https://git-scm.com](https://git-scm.com)

### Verifying Prerequisites

```bash
php -v          # Should show 8.2 or higher
composer -V     # Should show Composer version
node -v         # Should show 20.x or higher
npm -v          # Should show 10.x or higher
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/LeasyLaige/UnitKeep.git
cd UnitKeep
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

> **Note:** The `.env.example` is already pre-configured for local development with SQLite. You shouldn't need to change anything.

Generate the application key (only if `APP_KEY` is empty):

```bash
php artisan key:generate
```

### 5. Create the Database

The project uses SQLite by default. Create the database file:

```bash
# Windows (PowerShell)
New-Item -Path database/database.sqlite -ItemType File -Force

# macOS / Linux
touch database/database.sqlite
```

### 6. Run Migrations & Seed the Database

```bash
php artisan migrate --seed
```

This will create all tables and seed the **Master Admin** account.

### 7. Start the Development Servers

You need **two terminals** running simultaneously:

**Terminal 1 — Vite (frontend assets & hot-reload):**

```bash
npm run dev
```

**Terminal 2 — Laravel (backend application):**

```bash
php artisan serve
```

### 8. Open the Application

Navigate to **[http://localhost:8000](http://localhost:8000)** in your browser.

> ⚠️ Do NOT visit `localhost:5173` — that is the Vite asset server. Always use **port 8000**.

---

## Default Login Credentials

| Field    | Value                |
|----------|----------------------|
| Email    | `admin@unitkeep.com` |
| Password | `password`           |

This is the **Master Admin** account created by the seeder. All future users (admins and tenants) must be created by an administrator from within the system — there is no public registration.

---

## Roles & Routing

The system has two roles:

| Role     | Dashboard URL       | Access                                              |
|----------|---------------------|-----------------------------------------------------|
| **Admin**  | `/admin/dashboard`  | Full system management (tenants, units, billing, etc.) |
| **Tenant** | `/tenant/dashboard` | View own unit, billing statements, submit maintenance requests |

After login, users are automatically redirected to their role-specific dashboard.

---

## Database Schema

The application uses the following tables:

| Table                  | Purpose                                         |
|------------------------|-------------------------------------------------|
| `users`                | Authentication, role (`admin`/`tenant`), `first_name`, `last_name` |
| `tenant_profiles`      | Extended tenant info (phone, emergency contact, etc.) |
| `condominium_units`    | Unit details (number, floor, building, rate, status) |
| `lease_contracts`      | Links a tenant to a unit with rental terms       |
| `billing_records`      | Monthly billing statements and payment tracking  |
| `maintenance_requests` | Repair/maintenance request submissions           |

### Entity Relationships

```
User (1) ──── (1) TenantProfile
                    │
                    ├──── (many) LeaseContract ──── (1) CondominiumUnit
                    │                │
                    │                └──── (many) BillingRecord
                    │
                    ├──── (many) BillingRecord
                    │
                    └──── (many) MaintenanceRequest ──── (1) CondominiumUnit
```

---

## Useful Commands

### Database

```bash
# Run migrations
php artisan migrate

# Reset database and re-seed (WARNING: destroys all data)
php artisan migrate:fresh --seed

# Run only the admin seeder
php artisan db:seed --class=AdminSeeder

# Open Tinker (interactive REPL)
php artisan tinker
```

### Testing

```bash
# Run all tests
php artisan test

# Run feature tests only
php artisan test --testsuite=Feature

# Run a specific test file
php artisan test tests/Feature/DashboardTest.php

# Run with a name filter
php artisan test --filter="admin can access admin dashboard"

# Run using Pest directly
./vendor/bin/pest
```

### Code Quality

```bash
# Format PHP code (Laravel Pint)
./vendor/bin/pint

# Format frontend code (Prettier)
npm run format

# Lint frontend code (ESLint)
npm run lint

# TypeScript type-check
npm run types
```

### Building for Production

```bash
npm run build
```

---

## Project Structure (Key Files)

```
app/
├── Http/
│   ├── Controllers/
│   │   └── DashboardController.php     # Role-based dashboard routing
│   ├── Middleware/
│   │   ├── EnsureUserIsAdmin.php       # Admin-only middleware
│   │   └── EnsureUserIsTenant.php      # Tenant-only middleware
│   └── Responses/
│       ├── LoginResponse.php           # Role-based post-login redirect
│       └── TwoFactorLoginResponse.php  # Role-based 2FA redirect
├── Models/
│   ├── User.php                        # User model with role helpers
│   ├── TenantProfile.php
│   ├── CondominiumUnit.php
│   ├── LeaseContract.php
│   ├── BillingRecord.php
│   └── MaintenanceRequest.php
├── Providers/
│   └── FortifyServiceProvider.php      # Auth config (registration disabled)
config/
│   └── fortify.php                     # Fortify features (registration off)
database/
├── migrations/                         # All table schemas
├── seeders/
│   ├── DatabaseSeeder.php
│   └── AdminSeeder.php                 # Master Admin account seeder
resources/js/
├── pages/
│   ├── admin/dashboard.tsx             # Admin dashboard page
│   ├── tenant/dashboard.tsx            # Tenant dashboard page
│   ├── auth/login.tsx                  # Login page (no registration link)
│   └── welcome.tsx                     # Landing page
routes/
├── web.php                             # Main route definitions
└── settings.php                        # User settings routes
```

---

## Troubleshooting

### "Unable to connect" / blank page
- Make sure **both** `npm run dev` (Terminal 1) and `php artisan serve` (Terminal 2) are running.
- Visit `http://localhost:8000`, **not** `http://localhost:5173`.

### "Table not found" errors
- Run `php artisan migrate --seed` to create all tables.

### Seeing the default Laravel welcome page
- Make sure `APP_URL=http://localhost:8000` is set in your `.env` file.
- Restart both servers after changing `.env`.

### Login not working
- Verify the database is seeded: `php artisan db:seed`
- Confirm the admin exists: `php artisan tinker` → `User::first()`

---

## License

This project is developed for academic/internal use.

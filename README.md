# AquaShare

A web platform connecting residents with water suppliers in the Dirty South locality of Buea, Cameroon. Residents can find suppliers, send water requests, chat in-app, and leave ratings — all from their phones.

**Group 10:** Etta Kirien, Ado Daniel, Siben Ian, Nah Tina Pearl, Amin Sebastian, Aliembom Velma

---

## Stack

- **Frontend:** React 19 + Vite 8
- **Backend:** PHP 8.2 (REST API)
- **Database:** MariaDB 10.4 (MySQLi)

---

## Project Structure

```
aquaShare/
├── frontend/               # React SPA
│   └── src/
│       ├── pages/          # Login, Register, Dashboard, Chat, Profile
│       ├── context/        # AuthContext
│       └── services/       # api.js — all API calls
├── backend/                # PHP API modules
│   ├── auth-module/        # Register, login, logout
│   ├── user-module/        # Profile creation and management
│   ├── supplier-module/    # Availability, pricing
│   ├── communication-module/ # In-app messaging
│   ├── request-module/     # Water requests
│   ├── rating-module/      # Ratings and feedback
│   ├── search-module/      # Supplier search and listing
│   ├── admin-module/       # User and system management
│   └── shared/             # config.php, advanceSQL.php, fxns.php, utilities
└── database/
    ├── schema.sql           # Full database schema
    └── setup/               # Browser-based DB installer
```

---

## Modules

| Module | Responsibility | Owner |
|---|---|---|
| Auth | Register, login, logout | Etta Kirien |
| User & Supplier | Profile creation, availability, pricing | Etta Kirien |
| Communication | In-app messaging (text, image, location) | Ado Daniel |
| Request | Send and track water requests | Amin Sebastian |
| Rating & Feedback | Rate suppliers after delivery | Nah Tina Pearl |
| Search & Discovery | List and filter available suppliers | Etta Kirien |
| Admin | Manage users and monitor activity | Siben Ian |
| Frontend (React UI) | All pages, components, design system | Aliembom Velma |

---

## Database

| Table | Description |
|---|---|
| `users` | All users — role: `resident`, `supplier`, `admin` |
| `resident_profile` | Address and landmark for residents |
| `supplier_profile` | Price, availability, delivery info for suppliers |
| `request` | Water requests from resident to supplier |
| `message` | In-app chat per request (text, image, location) |
| `rating` | Resident rates a supplier (one per pair) |

---

## Setup

### Backend

```bash
cd backend
php -S 127.0.0.1:5400
```

**Database install:**
1. Visit `http://localhost:5400/` and navigate to the setup page
2. Enter your MySQL credentials and click **Install Database**

Update `backend/shared/config/config.php` with your credentials:
```php
const DB_HOST = '127.0.0.1',
      DB_USER = 'root',
      DB_PASS = '',
      DB_NAME = 'aquashare';
```

> Use `127.0.0.1` not `localhost` — `localhost` causes socket errors on MAMP/XAMPP.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:4200`. Proxies `/backend` requests to `http://127.0.0.1:5400`.

---

## User Roles

| Role | Can do |
|---|---|
| `resident` | Browse suppliers, send requests, chat, rate |
| `supplier` | Receive requests, chat, manage availability and pricing |
| `admin` | View and manage all users and data |

---

## How It Works

1. Resident searches for available suppliers and views their pricing
2. Resident sends a water request to a supplier
3. Both parties communicate in-app (text, images, location)
4. Supplier physically collects containers, fills them, and delivers
5. Resident pays the supplier in cash
6. Resident rates the supplier in-app

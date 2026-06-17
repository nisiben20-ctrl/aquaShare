# AquaShare

A web platform connecting residents with water suppliers in the Dirty South locality of Buea, Cameroon. Residents can find suppliers, send water requests, communicate, and leave ratings — all from their phones.

---

## Stack

- **Frontend:** React + Vite
- **Backend:** PHP 8.2 (REST API)
- **Database:** MariaDB 10.4 (MySQLi)
- **Notifications:** Africa's Talking SMS API (fire-and-forget, no DB storage)

---

## Project Structure

```
aquaShare/
├── backend/                  # Backend API server
│   ├── admin-module/         # Admin features
│   ├── auth-module/          # Registration, login
│   ├── communication-module/ # In-app messaging (send, get, markread)
│   ├── rating-module/        # Ratings and reviews
│   ├── request-module/       # Request creation and management
│   ├── search-module/        # Search functionality
│   ├── supplier-module/      # Supplier availability and prices
│   ├── user-module/          # User profile management
│   └── shared/               # Shared logic, database connection, config
├── database/                 # Database schema files
│   └── schema.sql
├── frontend/                 # Frontend — React
│   ├── src/
│   │   ├── services/api.js   # API service connecting to backend
│   │   └── pages/            # React UI components
```

---

## Database Schema

| Table | Description |
|---|---|
| `users` | All users — role: `resident`, `supplier`, `admin` |
| `resident_profile` | Address and landmark for residents |
| `supplier_profile` | Price, availability, delivery info, WhatsApp for suppliers |
| `request` | Water requests from resident to supplier |
| `message` | In-app chat per request (text, image, location) |
| `rating` | Resident rates a supplier (one per resident-supplier pair) |

---

## Setup

### Backend (PHP)

**Option A — PHP built-in server (recommended for dev):**
```bash
cd backend
php -S 127.0.0.1:5400
```
This runs the PHP backend on port 5400.

**Option B — MAMP/XAMPP:**
1. Place the project in your server's `htdocs` (XAMPP) or `htdocs` (MAMP) folder.
2. Start Apache + MySQL from the MAMP/XAMPP control panel.

**Database install:**
Import the `database/schema.sql` into your MySQL instance:
```bash
mysql -u root -p aquashare < database/schema.sql
```

**Config:**
Update `backend/shared/config/config.php` with your DB credentials if needed.
```php
const DB_HOST = '127.0.0.1',  // use 127.0.0.1, not localhost
      DB_USER = 'root',
      DB_PASS = 'root',
      DB_NAME = 'aquashare';
```

---

## Modules

The backend is strictly divided into modules. Each module has its own `README.md` file detailing the endpoints:

- **Admin Module:** `backend/admin-module/README.md`
- **Auth Module:** `backend/auth-module/README.md`
- **Communication Module:** `backend/communication-module/README.md`
- **Rating Module:** `backend/rating-module/README.md`
- **Request Module:** `backend/request-module/README.md`
- **Search Module:** `backend/search-module/README.md`
- **Supplier Module:** `backend/supplier-module/README.md`
- **User Module:** `backend/user-module/README.md`

---

## User Roles

| Role | Can do |
|---|---|
| `resident` | Browse suppliers, send requests, message, rate |
| `supplier` | Receive requests, message, update availability |
| `admin` | View all data, ban users |

---

## Physical Flow

1. Resident views supplier listing → opens supplier detail
2. Resident sends a water request
3. Supplier receives SMS notification (Africa's Talking)
4. Both parties communicate in-app (text, images, location pins)
5. Supplier physically collects containers, fills them, delivers
6. Resident pays supplier in cash
7. Resident rates the supplier in-app

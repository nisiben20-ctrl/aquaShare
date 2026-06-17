# Admin Module

This module handles administrative tasks for AquaShare.

## Endpoints

### 1. Get Statistics
- **URL:** `/admin-module/get_stats.php`
- **Method:** `GET`
- **Description:** Returns total users, total suppliers, and request statistics.
- **Access:** Admin only.

### 2. Get Users
- **URL:** `/admin-module/get_users.php`
- **Method:** `GET`
- **Description:** Returns a list of all registered users in the platform.
- **Access:** Admin only.

### 3. Ban / Unban User
- **URL:** `/admin-module/ban_user.php`
- **Method:** `POST`
- **Parameters:**
  - `user_id` (int): The ID of the user to update.
  - `is_active` (int): `1` for active, `0` for banned.
- **Description:** Updates the active status of a user.
- **Access:** Admin only.

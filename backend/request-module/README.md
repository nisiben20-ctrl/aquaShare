# Request Module

This module handles water requests sent from residents to suppliers.

## Endpoints

### 1. Create Request
- **URL:** `/request-module/create.php`
- **Method:** `POST`
- **Parameters:**
  - `supplier_id` (int)
  - `quantity` (int)
  - `note` (string, optional)
- **Description:** Creates a new request with a `pending` status.
- **Access:** Residents only.

### 2. Get All Requests
- **URL:** `/request-module/get_all.php`
- **Method:** `GET`
- **Description:** Fetches all requests involving the current user. If the user is a resident, it returns requests they made. If the user is a supplier, it returns requests sent to them.

### 3. Update Request Status
- **URL:** `/request-module/update_status.php`
- **Method:** `POST`
- **Parameters:**
  - `request_id` (int)
  - `status` (string: `pending`, `accepted`, `rejected`, `completed`, `cancelled`)
- **Description:** Updates the status of a request. Residents can only `cancel`. Suppliers can `accept`, `reject`, or `complete`.

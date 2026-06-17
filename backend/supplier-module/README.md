# Supplier Module

This module handles supplier-specific profile settings.

## Endpoints

### 1. Update Availability
- **URL:** `/supplier-module/update_availability.php`
- **Method:** `POST`
- **Parameters:** `is_available` (1 or 0)
- **Description:** Toggles whether the supplier is currently available to take requests.
- **Access:** Suppliers only.

### 2. Update Price and Unit
- **URL:** `/supplier-module/update_price.php`
- **Method:** `POST`
- **Parameters:**
  - `price` (float)
  - `description` (string)
- **Description:** Updates the supplier's price per unit and the description of the unit (e.g. "25L jerry can").
- **Access:** Suppliers only.

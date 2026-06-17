# Rating Module

This module allows residents to rate and review suppliers.

## Endpoints

### 1. Create / Update Rating
- **URL:** `/rating-module/create.php`
- **Method:** `POST`
- **Parameters:**
  - `supplier_id` (int): ID of the supplier being rated.
  - `score` (int): 1 to 5.
  - `comment` (string, optional): Review text.
- **Description:** Submits a rating. If the resident already rated this supplier, it updates the existing rating.
- **Access:** Residents only.

### 2. Get Ratings for Supplier
- **URL:** `/rating-module/get.php`
- **Method:** `GET`
- **Parameters:** `supplier_id`
- **Description:** Returns all ratings and comments for a specific supplier.

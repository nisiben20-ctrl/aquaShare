# Search Module

This module allows residents to search for active suppliers.

## Endpoints

### 1. Search Suppliers
- **URL:** `/search-module/index.php`
- **Method:** `GET`
- **Parameters:** `q` (string, optional)
- **Description:** Returns a list of active suppliers. If `q` is provided, it filters suppliers by name, address, or landmark. Also computes their average rating.

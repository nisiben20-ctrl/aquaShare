# Communication Module

This module handles the in-app chat between residents and suppliers within the scope of a request.

## Endpoints

### 1. Get Messages
- **URL:** `/communication-module/get.php`
- **Method:** `GET`
- **Parameters:** `request_id`
- **Description:** Retrieves all messages for a specific request. Automatically marks unread messages from the other party as read.

### 2. Send Message
- **URL:** `/communication-module/send.php`
- **Method:** `POST`
- **Parameters:**
  - `request_id` (int)
  - `type` (string: `text`, `image`, `location`)
  - `body` (string)
  - `image` (file, if type is image)
- **Description:** Sends a message or image.

### 3. Mark Messages as Read
- **URL:** `/communication-module/markread.php`
- **Method:** `POST`
- **Parameters:** `request_id`
- **Description:** Explicitly marks all messages from the other party as read.

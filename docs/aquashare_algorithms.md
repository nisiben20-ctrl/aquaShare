# AquaShare: Algorithms

### 1. User Registration Algorithm
START
Input full name, phone number, email, password, and role (Resident or Supplier)
IF email or phone number already exists THEN
    Display "Account already exists"
ELSE
    Save user registration details
    IF role = "Resident" THEN
        Prompt user to configure address and landmark details
    ELSE IF role = "Supplier" THEN
        Prompt user to configure price, unit description, and WhatsApp details
    ENDIF
    Display "Registration successful"
ENDIF
END

### 2. User Login Algorithm
START
Input email and password
IF credentials are correct THEN
    Retrieve user role and profile information
    Grant access to corresponding dashboard
ELSE
    Display "Invalid login credentials"
ENDIF
END

### 3. Profile & Availability Management Algorithm (Supplier)
START
Supplier logs in
Toggle availability status (Online or Offline)
Input new price and unit description (optional)

IF status updated THEN
    Save status to database
    Update visibility status in active supplier search list
ENDIF
IF price details updated THEN
    Save new price and unit description to database
ENDIF
END

### 4. Water Request Posting Algorithm (Resident)
START
Resident logs in
Search and select an online supplier
Input:
    quantity
    delivery note (optional)

Calculate:
    estimated cost = quantity * supplier price per unit

IF details are valid THEN
    Save request to database
    Set status = "Pending"
    Notify supplier via SMS (Africa's Talking API)
ELSE
    Display error message
ENDIF
END

### 5. Request Acceptance Algorithm (Supplier)
START
Supplier logs in
Browse pending requests
Select request

IF Supplier accepts request THEN
    Update request status = "Accepted"
    Notify resident via SMS
ELSE IF Supplier rejects request THEN
    Update request status = "Rejected"
ENDIF
END

### 6. In-App Chat Communication Algorithm
START
User selects active request thread
Input chat message (text, image, or location coordinates)

IF message is valid THEN
    Save message to database
    Mark message as unread for recipient
    Display message in chat window
    WHEN recipient opens chat THEN
        Update message status = "Read"
    ENDWHEN
ELSE
    Display message delivery failure
ENDIF
END

### 7. Request Completion & Payment Algorithm
START
Supplier delivers water to resident
Supplier marks request as completed

IF resident pays supplier in cash THEN
    Update request status = "Completed"
    Notify resident to submit review
ELSE
    Keep request status = "Accepted"
ENDIF
END

### 8. Supplier Rating & Review Algorithm
START
Resident selects completed request
Input:
    rating score (1-5 stars)
    comment (optional)

IF rating details are valid THEN
    Save rating and comment to database
    Recalculate supplier's average rating
    Update supplier's public profile rating
    Display "Thank you for your review"
ELSE
    Display error message
ENDIF
END

Algorithm for AquaShare

1. User logs into account.
2. System checks user credentials and identifies role (Resident or Supplier).
3. If user is a Resident:
   - Search for suppliers by name or neighborhood location.
   - Retrieve list of available (online) suppliers.
   - Resident places request with quantity and optional note.
   - Calculate total cost based on quantity and price per unit.
4. If user is a Supplier:
   - Toggle availability status (online/offline).
   - Set price and description per unit of water.
   - Retrieve list of incoming requests.
5. If request status is pending:
   - Supplier accepts request (marks status as accepted) or rejects request (marks status as rejected).
6. If request status is accepted:
   - Both users communicate in-app (exchanging text, images, or location pins).
7. Once water is physically delivered:
   - Supplier marks the request status as completed.
   - Resident rates the supplier (1 to 5 stars).
8. Recalculate and update the supplier's average rating.
9. Update dashboards with the latest request and rating information.
10. End process.

START
  Login User
  IF Role = Resident THEN
    Search Suppliers
    Retrieve Available Suppliers
    Resident Places Request
    Send SMS Notification to Supplier
    WHILE Request is Active
      IF Message Sent THEN
        Deliver Chat Message
        Mark Message as Read
      END IF
    END WHILE
    IF Request Completed THEN
      Resident Rates Supplier
      Recalculate Average Rating
    END IF
  ELSE IF Role = Supplier THEN
    Retrieve Incoming Requests
    FOR each Request
      IF Request Status = Pending THEN
        IF Supplier Accepts THEN
          Status = Accepted
          Send SMS Notification to Resident
        ELSE
          Status = Rejected
        END IF
      ELSE IF Request Status = Accepted THEN
        IF Delivery Completed THEN
          Status = Completed
          Send SMS Notification to Resident
        END IF
      END IF
    END FOR
  END IF
  Display Results
END

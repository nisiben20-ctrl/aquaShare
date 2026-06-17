# AquaShare Summary Algorithm

This document defines the high-level, step-by-step process flow of the AquaShare system, structured in a simple Input-Processing-Output (recipe-style) format.

---

## The Water Supply Request Algorithm

### Input (Ingredients)
1. Resident's registration credentials, delivery address, and landmark details.
2. Water supplier's registration credentials, pricing, and availability status (online/offline).
3. Resident's requested water quantity (number of containers).

---

### Steps (Recipe Instructions)

1. **Read User Credentials**: Verify the input email and password.
   *(Comment: This authenticates the user and retrieves their role to determine whether to load the Resident or Supplier dashboard.)*

2. **Check User Role**:
   - If the user is a **Resident**, proceed to Step 3.
   - If the user is a **Supplier**, proceed to Step 4.

3. **Browse & Order (Resident Flow)**:
   - Read search query (name or neighborhood location) entered by the Resident.
   - Retrieve and display the list of all online/available suppliers matching the query.
   - Read the selected supplier, desired quantity, and optional note.
   - Calculate total cost: `Quantity * Supplier's price per unit`.
   - Save the request details with a status of **Pending**.
   - Send an automated SMS alert to the Supplier.
   - Proceed to Step 5.

4. **Review & Action (Supplier Flow)**:
   - Retrieve all incoming pending water requests.
   - Read the Supplier's selection (Accept or Reject).
   - If the Supplier accepts:
     - Update status to **Accepted**.
     - Send SMS confirmation to the Resident.
     - Open in-app chat communication thread.
     - Proceed to Step 5.
   - If the Supplier rejects:
     - Update status to **Rejected**.
     - Terminate process.

5. **Coordinate & Chat**:
   - Allow Resident and Supplier to exchange text messages, images of containers, or location coordinates.
   *(Comment: This facilitates coordination of delivery and directions to the landmark.)*

6. **Deliver & Pay**:
   - Supplier physically delivers the requested water units to the resident's address.
   - Resident provides cash payment to the supplier.
   - Read completion confirmation input from the Supplier.
   - Update request status to **Completed**.

7. **Rate & Feedback**:
   - Read rating score (1 to 5 stars) and review comment from the Resident.
   - Update the Supplier's overall average rating.
   *(Comment: This dynamically calculates the running average rating to show to other residents during future searches.)*

---

### Output (Finished Dish)
- Water containers successfully delivered to the resident's landmark.
- Cash payment received by the supplier.
- Order transaction recorded as `Completed` with rating feedback updated.

<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Both residents (to cancel) and suppliers (to accept/reject/complete) can update status, but with restrictions
    if (!USER_INFO) {
        die(Error(4, "Unauthorized"));
    }

    $request_id = isset($_POST['request_id']) ? (int)$_POST['request_id'] : 0;
    $status = isset($_POST['status']) ? trim($_POST['status']) : '';
    $allowed_statuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

    if ($request_id <= 0 || !in_array($status, $allowed_statuses)) {
        die(Error(5, "Invalid request ID or status"));
    }

    $conn = connectDB();
    
    // Verify the request belongs to this user
    $userId = USER_INFO['id'];
    if (USER_INFO['role'] === 'supplier') {
        $checkQuery = "SELECT id, status FROM request WHERE id = $request_id AND supplier_id = $userId";
    } else {
        $checkQuery = "SELECT id, status FROM request WHERE id = $request_id AND resident_id = $userId";
        // Resident can only cancel
        if ($status !== 'cancelled') {
            die(Error(4, "Unauthorized: Residents can only cancel requests"));
        }
    }
    
    $checkResult = mysqli_query($conn, $checkQuery);
    if (!$checkResult || mysqli_num_rows($checkResult) === 0) {
        die(Error(5, "Request not found or unauthorized"));
    }

    [$err, $result] = advanceUpdate('request', ['status' => $status], ['id' => $request_id], $conn);

    if ($err) {
        die(Error(2, 'Unable to update status: ' . $err));
    }

    echo Result("Status Updated", ['id' => $request_id, 'status' => $status]);
    exit(0);

} else {
    die(Error(2, "Invalid Request Method"));
}

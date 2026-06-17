<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (!USER_INFO) {
        die(Error(4, "Unauthorized"));
    }

    $userId = USER_INFO['id'];
    $role = USER_INFO['role'];
    $conn = connectDB();

    if ($role === 'supplier') {
        $query = "
            SELECT r.*, u.full_name as resident_name, u.phone as resident_phone 
            FROM request r 
            JOIN users u ON r.resident_id = u.id 
            WHERE r.supplier_id = $userId 
            ORDER BY r.created_at DESC
        ";
    } else {
        $query = "
            SELECT r.*, u.full_name as supplier_name 
            FROM request r 
            JOIN users u ON r.supplier_id = u.id 
            WHERE r.resident_id = $userId 
            ORDER BY r.created_at DESC
        ";
    }

    $result = mysqli_query($conn, $query);
    if (!$result) {
        die(Error(2, 'Failed to fetch requests: ' . mysqli_error($conn)));
    }
    
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // Type casting
        $row['id'] = (int)$row['id'];
        $row['resident_id'] = (int)$row['resident_id'];
        $row['supplier_id'] = (int)$row['supplier_id'];
        $row['quantity'] = (int)$row['quantity'];
        $data[] = $row;
    }

    echo Result("Requests retrieved", $data);
    exit(0);

} else {
    die(Error(2, "Invalid Request Method"));
}

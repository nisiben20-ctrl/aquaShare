<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

header("Content-Type: application/json");

// Require admin
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    die(Error(1, "Unauthorized access"));
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $conn = connectDB();
    $query = "
        SELECT u.id, u.full_name, u.phone, u.email, u.address, u.created_at,
               sp.address as sp_address, sp.landmark, sp.price_per_unit, 
               sp.unit_description, sp.is_verified
        FROM users u
        JOIN supplier_profile sp ON u.id = sp.user_id
        WHERE u.role = 'supplier' AND sp.is_verified = 0
        ORDER BY u.created_at DESC
    ";
    
    $result = mysqli_query($conn, $query);

    if (!$result) {
        die(Error(2, 'Failed to retrieve pending suppliers: ' . mysqli_error($conn)));
    }
    
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $row['id'] = (int)$row['id'];
        $row['price_per_unit'] = (float)$row['price_per_unit'];
        $row['is_verified'] = (int)$row['is_verified'];
        $data[] = $row;
    }
    
    echo Result("Pending suppliers retrieved", $data);
} else {
    die(Error(2, "Invalid Request Method"));
}
?>

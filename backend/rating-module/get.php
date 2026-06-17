<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $supplier_id = isset($_GET['supplier_id']) ? (int)$_GET['supplier_id'] : 0;

    if ($supplier_id <= 0) {
        die(Error(5, "Invalid supplier ID"));
    }

    $conn = connectDB();
    
    $query = "
        SELECT r.id, r.score, r.comment, r.created_at, u.full_name as resident_name 
        FROM rating r 
        JOIN users u ON r.resident_id = u.id 
        WHERE r.supplier_id = $supplier_id 
        ORDER BY r.created_at DESC
    ";

    $result = mysqli_query($conn, $query);
    if (!$result) {
        die(Error(2, 'Failed to fetch ratings: ' . mysqli_error($conn)));
    }
    
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $row['id'] = (int)$row['id'];
        $row['score'] = (int)$row['score'];
        $data[] = $row;
    }

    echo Result("Ratings retrieved", $data);
    exit(0);

} else {
    die(Error(2, "Invalid Request Method"));
}

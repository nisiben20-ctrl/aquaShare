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
    $query = "SELECT * FROM contact_messages ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);

    if (!$result) {
        die(Error(2, 'Failed to retrieve messages: ' . mysqli_error($conn)));
    }
    
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $row['id'] = (int)$row['id'];
        $data[] = $row;
    }
    
    echo Result("Messages retrieved", $data);
} else {
    die(Error(2, "Invalid Request Method"));
}
?>

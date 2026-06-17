<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (!USER_INFO || USER_INFO['role'] !== 'admin') {
        die(Error(4, "Unauthorized: Admin access required"));
    }

    $conn = connectDB();
    
    // Get counts
    $stats = [
        'total_users' => 0,
        'total_suppliers' => 0,
        'total_requests' => 0,
        'completed_requests' => 0
    ];

    $res = mysqli_query($conn, "SELECT COUNT(*) as c FROM users");
    if ($row = mysqli_fetch_assoc($res)) $stats['total_users'] = (int)$row['c'];

    $res = mysqli_query($conn, "SELECT COUNT(*) as c FROM users WHERE role = 'supplier'");
    if ($row = mysqli_fetch_assoc($res)) $stats['total_suppliers'] = (int)$row['c'];

    $res = mysqli_query($conn, "SELECT COUNT(*) as c FROM request");
    if ($row = mysqli_fetch_assoc($res)) $stats['total_requests'] = (int)$row['c'];

    $res = mysqli_query($conn, "SELECT COUNT(*) as c FROM request WHERE status = 'completed'");
    if ($row = mysqli_fetch_assoc($res)) $stats['completed_requests'] = (int)$row['c'];

    echo Result("Stats retrieved", $stats);
    exit(0);
} else {
    die(Error(2, "Invalid Request Method"));
}

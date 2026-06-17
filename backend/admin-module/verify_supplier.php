<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

header("Content-Type: application/json");

// Require admin
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    die(Error(1, "Unauthorized access"));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $supplier_id = isset($_POST['supplier_id']) ? (int)$_POST['supplier_id'] : 0;
    
    // Also try to read from JSON body
    if ($supplier_id === 0) {
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['supplier_id'])) {
            $supplier_id = (int)$data['supplier_id'];
        }
    }
    // Also try fallback if the frontend sent user_id instead
    if ($supplier_id === 0) {
        $supplier_id = isset($_POST['user_id']) ? (int)$_POST['user_id'] : 0;
    }

    if ($supplier_id <= 0) {
        die(Error(5, "Invalid supplier ID"));
    }

    $conn = connectDB();
    $stmt = mysqli_prepare($conn, "UPDATE supplier_profile SET is_verified = 1 WHERE user_id = ?");
    mysqli_stmt_bind_param($stmt, "i", $supplier_id);
    
    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) > 0) {
            echo Result("Supplier verified successfully");
        } else {
            // Already verified or not a supplier
            echo Result("Supplier verified or not found");
        }
    } else {
        die(Error(2, "Failed to verify supplier"));
    }
} else {
    die(Error(2, "Invalid Request Method"));
}
?>

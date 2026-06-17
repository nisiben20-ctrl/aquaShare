<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!USER_INFO || USER_INFO['role'] !== 'resident') {
        die(Error(4, "Unauthorized: Only residents can rate suppliers"));
    }

    $supplier_id = isset($_POST['supplier_id']) ? (int)$_POST['supplier_id'] : 0;
    $score = isset($_POST['score']) ? (int)$_POST['score'] : 0;
    $comment = isset($_POST['comment']) ? trim($_POST['comment']) : null;

    if ($supplier_id <= 0 || $score < 1 || $score > 5) {
        die(Error(5, "Invalid supplier ID or score (must be 1-5)"));
    }

    $conn = connectDB();
    
    // Check if supplier exists
    $checkQuery = "SELECT id FROM users WHERE id = $supplier_id AND role = 'supplier'";
    $checkResult = mysqli_query($conn, $checkQuery);
    if (!$checkResult || mysqli_num_rows($checkResult) === 0) {
        die(Error(5, "Supplier not found"));
    }

    // Insert or update rating
    $resident_id = USER_INFO['id'];
    $comment_sql = $comment ? "'".mysqli_real_escape_string($conn, $comment)."'" : "NULL";
    
    $query = "
        INSERT INTO rating (resident_id, supplier_id, score, comment)
        VALUES ($resident_id, $supplier_id, $score, $comment_sql)
        ON DUPLICATE KEY UPDATE score = $score, comment = $comment_sql, updated_at = CURRENT_TIMESTAMP
    ";

    $result = mysqli_query($conn, $query);
    if (!$result) {
        die(Error(2, 'Failed to save rating: ' . mysqli_error($conn)));
    }

    echo Result("Rating saved", ['supplier_id' => $supplier_id, 'score' => $score]);
    exit(0);

} else {
    die(Error(2, "Invalid Request Method"));
}

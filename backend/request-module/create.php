<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!USER_INFO || USER_INFO['role'] !== 'resident') {
        die(Error(4, "Unauthorized: Only residents can create requests"));
    }

    $supplier_id = isset($_POST['supplier_id']) ? (int)$_POST['supplier_id'] : 0;
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;
    $note = isset($_POST['note']) ? trim($_POST['note']) : null;

    if ($supplier_id <= 0 || $quantity <= 0) {
        die(Error(5, "Invalid supplier or quantity"));
    }

    $conn = connectDB();
    // Verify supplier exists
    $checkQuery = "SELECT id FROM users WHERE id = $supplier_id AND role = 'supplier' AND is_active = 1";
    $checkResult = mysqli_query($conn, $checkQuery);
    
    if (!$checkResult || mysqli_num_rows($checkResult) === 0) {
        die(Error(5, "Supplier not found or inactive"));
    }

    $param = [
        'resident_id' => USER_INFO['id'],
        'supplier_id' => $supplier_id,
        'quantity' => $quantity,
        'note' => $note,
        'status' => 'pending'
    ];

    [$err, $requestId] = advanceInsert('request', $param, $conn);

    if ($err) {
        die(Error(2, 'Unable to create request: ' . $err));
    }
    
    // Fetch the full request object back to return
    $query = "
        SELECT r.*, u.full_name as supplier_name 
        FROM request r 
        JOIN users u ON r.supplier_id = u.id 
        WHERE r.id = $requestId
    ";
    $res = mysqli_query($conn, $query);
    $requestData = mysqli_fetch_assoc($res);

    echo Result("Request Created", $requestData);
    exit(0);

} else {
    die(Error(2, "Invalid Request Method"));
}

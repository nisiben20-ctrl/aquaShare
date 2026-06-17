<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!USER_INFO || USER_INFO['role'] !== 'supplier') {
        die(Error(4, "Unauthorized: Only suppliers can update price"));
    }

    $price_per_unit = isset($_POST['price']) ? (float)$_POST['price'] : 0;
    $unit_description = isset($_POST['description']) ? trim($_POST['description']) : '25L jerry can';

    if ($price_per_unit <= 0) {
        die(Error(5, "Price must be greater than 0"));
    }

    [$err, $result] = advanceUpdate(
        'supplier_profile', 
        [
            'price_per_unit' => $price_per_unit,
            'unit_description' => $unit_description
        ], 
        ['user_id' => USER_INFO['id']]
    );

    if ($err) {
        die(Error(2, 'Unable to update price: ' . $err));
    }

    // Update session profile if exists
    if (isset($_SESSION['profile'])) {
        $_SESSION['profile']['price_per_unit'] = $price_per_unit;
        $_SESSION['profile']['unit_description'] = $unit_description;
    }

    echo Result("Price Updated", [
        'price_per_unit' => $price_per_unit,
        'unit_description' => $unit_description
    ]);
    exit(0);
} else {
    die(Error(2, "Invalid Request Method"));
}

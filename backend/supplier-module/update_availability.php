<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!USER_INFO || USER_INFO['role'] !== 'supplier') {
        die(Error(4, "Unauthorized: Only suppliers can update availability"));
    }

    $is_available = isset($_POST['is_available']) ? (int)$_POST['is_available'] : 1;

    [$err, $result] = advanceUpdate('supplier_profile', ['is_available' => $is_available], ['user_id' => USER_INFO['id']]);

    if ($err) {
        die(Error(2, 'Unable to update availability: ' . $err));
    }

    // Update session profile if exists
    if (isset($_SESSION['profile'])) {
        $_SESSION['profile']['is_available'] = $is_available;
    }

    echo Result("Availability Updated", ['is_available' => $is_available]);
    exit(0);
} else {
    die(Error(2, "Invalid Request Method"));
}

<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!USER_INFO || USER_INFO['role'] !== 'admin') {
        die(Error(4, "Unauthorized: Admin access required"));
    }

    $user_id = isset($_POST['user_id']) ? (int)$_POST['user_id'] : 0;
    $is_active = isset($_POST['is_active']) ? (int)$_POST['is_active'] : 1;

    if ($user_id <= 0) {
        die(Error(5, "Invalid user ID"));
    }

    if ($user_id === USER_INFO['id']) {
        die(Error(5, "Cannot ban yourself"));
    }

    [$err, $result] = advanceUpdate('users', ['is_active' => $is_active], ['id' => $user_id]);

    if ($err) {
        die(Error(2, 'Unable to update user status: ' . $err));
    }

    echo Result("User status updated", ['user_id' => $user_id, 'is_active' => $is_active]);
    exit(0);

} else {
    die(Error(2, "Invalid Request Method"));
}

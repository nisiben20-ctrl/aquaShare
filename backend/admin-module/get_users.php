<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (!USER_INFO || USER_INFO['role'] !== 'admin') {
        die(Error(4, "Unauthorized: Admin access required"));
    }

    [$err, $users] = advanceSelect('users', 'id, full_name, phone, email, role, is_active, created_at');

    if ($err) {
        die(Error(2, 'Failed to fetch users: ' . $err));
    }

    echo Result("Users retrieved", $users);
    exit(0);
} else {
    die(Error(2, "Invalid Request Method"));
}

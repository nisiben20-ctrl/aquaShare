<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    if (empty($email) || empty($password)) {
        die(Error(5, "Email and password are required"));
    }

    $conn = connectDB();
    
    $stmt = mysqli_prepare(
        $conn,
        "SELECT id, full_name, phone, email, address, password_hash, role, is_active FROM users WHERE email = ?"
    );

    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) == 1) {

        $user = mysqli_fetch_assoc($result);

        if ($user['is_active'] == 0) {
            die(Error(3, "Your account has been banned. Contact admin."));
        }

        if (password_verify($password, $user['password_hash'])) {

            // Fix session management warning on multiple calls
            if (session_status() === PHP_SESSION_ACTIVE) {
                session_regenerate_id(true);
            }

            // Our config uses $_SESSION['user'] instead of individual properties
            $userData = [
                "id" => $user['id'],
                "full_name" => $user['full_name'],
                "phone" => $user['phone'],
                "email" => $user['email'],
                "address" => $user['address'],
                "role" => $user['role']
            ];
            
            $_SESSION['user'] = $userData;

            // Fetch and set profile
            $profile = null;
            $role = $user['role'];
            if ($role === 'supplier' || $role === 'resident') {
                [$err, $profiles] = advanceSelect($role . "_profile", "*", ['user_id' => $user['id']], $conn);
                if (!$err && count($profiles)) {
                    $profile = $profiles[0];
                }
            }

            if ($role === 'supplier' && $profile && $profile['is_verified'] == 0) {
                die(Error(3, "Your supplier account is pending verification by an admin."));
            }

            $_SESSION['profile'] = $profile;

            echo Result("Login successful", [
                "user" => $userData,
                "profile" => $profile
            ]);
            exit();

        } else {
            die(Error(5, "Invalid password"));
        }

    } else {
        die(Error(5, "User not found"));
    }
} else {
    die(Error(2, "Invalid Request Method"));
}
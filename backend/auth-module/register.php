<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $full_name = isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    $address = isset($_POST['address']) ? trim($_POST['address']) : '';

    // DYNAMIC ROLE (Resident or Supplier)
    $role = isset($_POST['role']) ? trim($_POST['role']) : 'resident';
    if ($role !== 'resident' && $role !== 'supplier') {
        $role = 'resident';
    }

    if (empty($full_name) || empty($phone) || empty($password)) {
        die(Error(5, "Required fields cannot be empty"));
    }

    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die(Error(5, "Invalid email address"));
    }

    $conn = connectDB();

    // CHECK IF PHONE EXISTS
    $check_stmt = mysqli_prepare($conn, "SELECT id FROM users WHERE phone = ?");
    mysqli_stmt_bind_param($check_stmt, "s", $phone);
    mysqli_stmt_execute($check_stmt);
    mysqli_stmt_store_result($check_stmt);

    if (mysqli_stmt_num_rows($check_stmt) > 0) {
        mysqli_stmt_close($check_stmt);
        die(Error(5, "Phone number already registered"));
    }
    mysqli_stmt_close($check_stmt);

    // CHECK IF EMAIL EXISTS
    if (!empty($email)) {
        $check_stmt2 = mysqli_prepare($conn, "SELECT id FROM users WHERE email = ?");
        mysqli_stmt_bind_param($check_stmt2, "s", $email);
        mysqli_stmt_execute($check_stmt2);
        mysqli_stmt_store_result($check_stmt2);

        if (mysqli_stmt_num_rows($check_stmt2) > 0) {
            mysqli_stmt_close($check_stmt2);
            die(Error(5, "Email address already registered"));
        }
        mysqli_stmt_close($check_stmt2);
    }

    // HASH PASSWORD
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // INSERT USER
    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO users (full_name, phone, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "ssssss",
        $full_name,
        $phone,
        $email,
        $password_hash,
        $address,
        $role
    );

    if (mysqli_stmt_execute($stmt)) {
        $new_id = mysqli_insert_id($conn);
        mysqli_stmt_close($stmt);

        // Also add them to the relevant profile table
        if ($role === 'resident') {
            $prof_stmt = mysqli_prepare($conn, "INSERT INTO resident_profile (user_id, address) VALUES (?, ?)");
            mysqli_stmt_bind_param($prof_stmt, "is", $new_id, $address);
            mysqli_stmt_execute($prof_stmt);
            mysqli_stmt_close($prof_stmt);
        } else if ($role === 'supplier') {
            $prof_stmt = mysqli_prepare($conn, "INSERT INTO supplier_profile (user_id, address, whatsapp) VALUES (?, ?, ?)");
            mysqli_stmt_bind_param($prof_stmt, "iss", $new_id, $address, $phone);
            mysqli_stmt_execute($prof_stmt);
            mysqli_stmt_close($prof_stmt);
        }

        echo Result("Registration successful", ["id" => $new_id, "role" => $role]);
        exit();
    } else {
        $error = mysqli_stmt_error($stmt);
        mysqli_stmt_close($stmt);
        die(Error(2, "Registration failed: " . $error));
    }
} else {
    die(Error(2, "Invalid Request Method"));
}
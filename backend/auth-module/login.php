<?php

session_start();
include("db.php");

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email) || empty($password)) {
        echo json_encode([
            "success" => false,
            "message" => "Email and password are required"
        ]);
        exit();
    }

    $stmt = mysqli_prepare(
        $conn,
        "SELECT id, full_name, password_hash, role FROM users WHERE email = ?"
    );

    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) == 1) {

        $user = mysqli_fetch_assoc($result);

        if (password_verify($password, $user['password_hash'])) {

            session_regenerate_id(true);

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['role'] = $user['role'];

            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $user['id'],
                    "full_name" => $user['full_name'],
                    "role" => $user['role']
                ]
            ]);
            exit();

        } else {
            echo json_encode([
                "success" => false,
                "message" => "Invalid password"
            ]);
            exit();
        }

    } else {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit();
    }
}
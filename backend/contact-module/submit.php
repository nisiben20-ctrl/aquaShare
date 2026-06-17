<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    if (empty($name) || empty($email) || empty($message)) {
        die(Error(5, "Name, email, and message are required."));
    }

    $conn = connectDB();
    
    $stmt = mysqli_prepare($conn, "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "sss", $name, $email, $message);
    
    if (mysqli_stmt_execute($stmt)) {
        echo Result("Message sent successfully");
    } else {
        die(Error(2, "Failed to save message"));
    }
} else {
    die(Error(2, "Invalid Request Method"));
}
?>

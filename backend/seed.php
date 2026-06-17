<?php
require_once __DIR__ . '/shared/config/config.php';
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$hash = '$2y$12$CgzrOABKTJBvjxGUuFaO4.vNi4fsMMwp6jv.4/wmtOQmvNEYGjUmy';
$stmt = $conn->prepare("INSERT INTO users (full_name, phone, email, password_hash, address, is_active, role) VALUES ('Admin', '000000000', 'admin@gmail.com', ?, 'Admin HQ', 1, 'admin')");
$stmt->bind_param("s", $hash);
if ($stmt->execute()) {
    echo "Admin user seeded successfully.\n";
} else {
    echo "Error: " . $stmt->error . "\n";
}
$stmt->close();
$conn->close();

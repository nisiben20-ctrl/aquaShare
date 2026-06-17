<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!USER_INFO) {
        die(Error(4, "User not authenticated"));
    }

    $user_id = USER_INFO['id'];
    $role    = USER_INFO['role'];

    // Collect fields
    $full_name = isset($_POST['full_name']) ? trim($_POST['full_name']) : null;
    $phone     = isset($_POST['phone'])     ? trim($_POST['phone'])     : null;
    $email     = isset($_POST['email'])     ? trim($_POST['email'])     : null;
    $address   = isset($_POST['address'])   ? trim($_POST['address'])   : null;
    $landmark  = isset($_POST['landmark'])  ? trim($_POST['landmark'])  : null;

    // For residents, always force "Dirty south"
    if ($role === 'resident') {
        $address = 'Dirty south';
    }

    // Validate email format if provided
    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die(Error(5, "Invalid email address"));
    }

    $conn = connectDB();

    // Check phone uniqueness (exclude current user)
    if ($phone) {
        $check_stmt = mysqli_prepare($conn, "SELECT id FROM users WHERE phone = ? AND id != ?");
        mysqli_stmt_bind_param($check_stmt, "si", $phone, $user_id);
        mysqli_stmt_execute($check_stmt);
        mysqli_stmt_store_result($check_stmt);
        if (mysqli_stmt_num_rows($check_stmt) > 0) {
            mysqli_stmt_close($check_stmt);
            die(Error(5, "Phone number already in use by another account"));
        }
        mysqli_stmt_close($check_stmt);
    }

    // Check email uniqueness (exclude current user)
    if ($email) {
        $check_stmt2 = mysqli_prepare($conn, "SELECT id FROM users WHERE email = ? AND id != ?");
        mysqli_stmt_bind_param($check_stmt2, "si", $email, $user_id);
        mysqli_stmt_execute($check_stmt2);
        mysqli_stmt_store_result($check_stmt2);
        if (mysqli_stmt_num_rows($check_stmt2) > 0) {
            mysqli_stmt_close($check_stmt2);
            die(Error(5, "Email address already in use by another account"));
        }
        mysqli_stmt_close($check_stmt2);
    }

    // Update users table fields that were provided
    $userUpdateFields = [];
    if ($full_name) $userUpdateFields['full_name'] = $full_name;
    if ($phone)     $userUpdateFields['phone']     = $phone;
    if ($email)     $userUpdateFields['email']     = $email;
    if ($address)   $userUpdateFields['address']   = $address;

    if (count($userUpdateFields)) {
        [$err] = advanceUpdate('users', $userUpdateFields, ['id' => $user_id], $conn);
        if ($err) {
            die(Error(2, "Failed to update user info: " . $err));
        }
    }

    // Determine profile table
    $profileTable = ($role === 'supplier') ? 'supplier_profile' : 'resident_profile';

    // Check if profile already exists
    [$err, $existing] = advanceSelect($profileTable, 'id', ['user_id' => $user_id], $conn);

    $profileParam = ['user_id' => $user_id];
    if ($address)  $profileParam['address']  = $address;
    if ($landmark !== null) $profileParam['landmark'] = $landmark;

    if (!$err && count($existing)) {
        // Profile exists — update it
        unset($profileParam['user_id']); // don't update user_id
        if (count($profileParam)) {
            [$err2, $result] = advanceUpdate($profileTable, $profileParam, ['user_id' => $user_id], $conn);
            if ($err2) {
                die(Error(2, "Failed to update profile: " . $err2));
            }
        }
    } else {
        // Profile doesn't exist — insert it
        if (!isset($profileParam['address']) || empty($profileParam['address'])) {
            $profileParam['address'] = ($role === 'resident') ? 'Dirty south' : 'N/A';
        }
        [$err3, $result] = advanceInsert($profileTable, $profileParam, $conn);
        if ($err3) {
            die(Error(2, "Failed to create profile: " . $err3));
        }
    }

    // Fetch updated user and profile
    [$uErr, $users]    = advanceSelect('users', '*', ['id' => $user_id], $conn);
    [$pErr, $profiles] = advanceSelect($profileTable, '*', ['user_id' => $user_id], $conn);

    $updatedUser    = (!$uErr && count($users))    ? $users[0]    : null;
    $updatedProfile = (!$pErr && count($profiles)) ? $profiles[0] : null;

    // Remove password hash before returning
    if ($updatedUser) unset($updatedUser['password_hash']);

    // Refresh session
    if ($updatedUser) {
        $_SESSION['user'] = [
            "id"        => $updatedUser['id'],
            "full_name" => $updatedUser['full_name'],
            "phone"     => $updatedUser['phone'],
            "email"     => $updatedUser['email'],
            "address"   => $updatedUser['address'],
            "role"      => $updatedUser['role'],
        ];
    }
    if ($updatedProfile) {
        $_SESSION['profile'] = $updatedProfile;
    }

    echo Result("Profile updated successfully", [
        'user'    => $_SESSION['user'],
        'profile' => $updatedProfile,
    ]);
    exit(0);

} else {
    die(Error(2, "Invalid Request Method"));
}

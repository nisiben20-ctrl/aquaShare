<?php
include __DIR__ . "/../shared/config/config.php";
include __DIR__ . "/../shared/utilities/fxns.php";
include __DIR__ . "/../shared/database/advanceSQL.php";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $searchTerm = isset($_GET['q']) ? trim($_GET['q']) : '';

    $conn = connectDB();
    $term = mysqli_real_escape_string($conn, "%{$searchTerm}%");
    
    $query = "
        SELECT 
            u.id, u.full_name, u.phone,
            sp.address, sp.landmark, sp.price_per_unit, sp.unit_description, 
            sp.delivery_available, sp.is_available,
            COALESCE(AVG(r.score), 0) as rating
        FROM users u
        JOIN supplier_profile sp ON u.id = sp.user_id
        LEFT JOIN rating r ON u.id = r.supplier_id
        WHERE u.role = 'supplier' AND u.is_active = 1 AND sp.is_verified = 1
    ";

    if (!empty($searchTerm)) {
        $query .= " AND (u.full_name LIKE '$term' OR sp.address LIKE '$term' OR sp.landmark LIKE '$term' OR sp.price_per_unit LIKE '$term') ";
    }

    $query .= " GROUP BY u.id ";
    
    $result = mysqli_query($conn, $query);
    if (!$result) {
        die(Error(2, 'Search failed: ' . mysqli_error($conn)));
    }
    
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // Cast types properly for frontend consumption
        $row['id'] = (int)$row['id'];
        $row['price_per_unit'] = (float)$row['price_per_unit'];
        $row['delivery_available'] = (bool)$row['delivery_available'];
        $row['is_available'] = (bool)$row['is_available'];
        $row['rating'] = round((float)$row['rating'], 1);
        $data[] = $row;
    }
    
    echo Result("Suppliers found", $data);
    exit(0);

} else {
    die(Error(2, "Invalid Request Method"));
}

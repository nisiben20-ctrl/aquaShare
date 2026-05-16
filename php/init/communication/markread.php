<?php
require_once __DIR__ . "/../../assets/config.php";
include __DIR__ . "/../../ado/fxns.php";
include __DIR__ . "/../../assets/advanceSQL.php";

authenticationCheck();

$requestId = (int) ($_POST['request_id'] ?? 0);
if (!$requestId) die(Error(5, "request_id is required"));

// verify caller is part of this request
[$err, $requests] = advanceSelect('request', 'resident_id, supplier_id', ['id' => $requestId]);
if ($err || !count($requests)) die(Error(1, "Request not found"));

$req    = $requests[0];
$userId = USER_INFO['id'];

if ($req['resident_id'] != $userId && $req['supplier_id'] != $userId) {
    die(Error(3, "Not part of this request"));
}

// mark all messages in this thread not sent by the caller as read
[$err, $affected] = advanceUpdate(
    'message',
    ['is_read' => 1],
    ['request_id' => $requestId, 'is_read' => 0]
);

if ($err) die(Error(2, "Could not mark messages as read: $err"));

echo Result("Messages marked as read", ['updated' => $affected]);

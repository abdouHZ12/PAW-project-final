<?php
// api/group/create.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$group_name = trim($_POST['group_name'] ?? '');

if ($group_name === '') {
    echo json_encode(["success" => false, "message" => "Group name required"]);
    exit;
}

// check exists
try {
    $stmt = $pdo->prepare('SELECT id_group FROM "groups" WHERE group_name = :g LIMIT 1');
    $stmt->execute(['g' => $group_name]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Group already exists"]);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO "groups" (group_name) VALUES (:g)');
    $stmt->execute(['g' => $group_name]);
    echo json_encode(["success" => true, "message" => "Group created"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

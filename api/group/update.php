<?php
// api/group/update.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$id_group = $_POST['id_group'] ?? null;
$group_name = trim($_POST['group_name'] ?? '');

if (!$id_group || $group_name === '') {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

try {
    // check uniqueness (other groups)
    $stmt = $pdo->prepare('SELECT id_group FROM "groups" WHERE group_name = :g AND id_group != :id LIMIT 1');
    $stmt->execute(['g' => $group_name, 'id' => $id_group]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Another group with this name exists"]);
        exit;
    }

    $stmt = $pdo->prepare('UPDATE "groups" SET group_name = :g WHERE id_group = :id');
    $stmt->execute(['g' => $group_name, 'id' => $id_group]);
    echo json_encode(["success" => true, "message" => "Group updated"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

<?php
// api/group/delete.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$id_group = $_POST['id_group'] ?? null;
if (!$id_group) {
    echo json_encode(["success" => false, "message" => "Missing id_group"]);
    exit;
}

try {
    // Unassign students first (optional) — we'll set id_group = NULL for students in that group
    $stmt = $pdo->prepare('UPDATE student SET id_group = NULL WHERE id_group = :id');
    $stmt->execute(['id' => $id_group]);

    // delete group
    $stmt = $pdo->prepare('DELETE FROM "groups" WHERE id_group = :id');
    $stmt->execute(['id' => $id_group]);

    echo json_encode(["success" => true, "message" => "Group deleted"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

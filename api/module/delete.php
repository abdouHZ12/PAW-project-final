<?php
// api/module/delete.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$id_module = $_POST['id_module'] ?? null;
if (!$id_module) {
    echo json_encode(["success" => false, "message" => "Missing id_module"]);
    exit;
}

try {
    // Optional: ensure no sessions reference this module (or cascade delete)
    $stmt = $pdo->prepare("SELECT id_session FROM session WHERE id_module = :id LIMIT 1");
    $stmt->execute(['id' => $id_module]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Cannot delete: module used by sessions"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM module WHERE id_module = :id");
    $stmt->execute(['id' => $id_module]);
    echo json_encode(["success" => true, "message" => "Module deleted"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

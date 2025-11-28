<?php
// api/session/delete.php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$id_session = $_POST['id_session'] ?? null;

if (!$id_session) {
    echo json_encode(["success" => false, "message" => "Missing id_session"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM session WHERE id_session = :id");
    $stmt->execute(['id' => $id_session]);
    echo json_encode(["success" => true, "message" => "Deleted"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

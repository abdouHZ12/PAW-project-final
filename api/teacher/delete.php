<?php
// api/teachers/delete.php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$id_teacher = $_POST['id_teacher'] ?? null;

if (!$id_teacher) {
    echo json_encode(["success" => false, "message" => "Missing id_teacher"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // get linked user
    $sql = "SELECT id_user FROM teacher WHERE id_teacher = :id LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $id_teacher]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $id_user = $row['id_user'];

    // delete teacher
    $sql = "DELETE FROM teacher WHERE id_teacher = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $id_teacher]);

    // delete user
    if ($id_user) {
        $sql = 'DELETE FROM "user" WHERE id_user = :uid';
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['uid' => $id_user]);
    }

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Teacher deleted"]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

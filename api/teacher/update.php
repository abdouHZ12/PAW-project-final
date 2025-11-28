<?php
// api/teachers/update.php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$id_teacher = $_POST['id_teacher'] ?? null;
$full_name  = $_POST['full_name'] ?? null;
$username   = $_POST['username'] ?? null;

if (!$id_teacher || !$full_name) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // update teacher
    $sql = "UPDATE teacher SET full_name = :fn WHERE id_teacher = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['fn' => $full_name, 'id' => $id_teacher]);

    if ($username !== null) {

        // find id_user
        $sql = "SELECT id_user FROM teacher WHERE id_teacher = :id LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id_teacher]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $id_user = $row['id_user'];

        // username must be unique
        $sql = 'SELECT id_user FROM "user" WHERE username = :u AND id_user != :uid';
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['u' => $username, 'uid' => $id_user]);

        if ($stmt->fetch()) {
            $pdo->rollBack();
            echo json_encode(["success" => false, "message" => "Username already taken"]);
            exit;
        }

        // update username
        $sql = 'UPDATE "user" SET username = :u WHERE id_user = :uid';
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['u' => $username, 'uid' => $id_user]);
    }

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Teacher updated"]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

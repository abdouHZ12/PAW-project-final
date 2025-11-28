<?php
// api/teachers/create.php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$full_name = $_POST['full_name'] ?? null;
$username  = $_POST['username'] ?? null;
$password  = $_POST['password'] ?? null;

if (!$full_name || !$username || !$password) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

// check username exists
$sql = 'SELECT id_user FROM "user" WHERE username = :u LIMIT 1';
$stmt = $pdo->prepare($sql);
$stmt->execute(['u' => $username]);

if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Username already taken"]);
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $pdo->beginTransaction();

    // CREATE USER
    $sql = 'INSERT INTO "user" (username, password, role) VALUES (:u, :p, :r) RETURNING id_user';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'u' => $username,
        'p' => $hash,
        'r' => 'teacher'
    ]);

    $user = $stmt->fetch();
    $id_user = $user['id_user'];

    // CREATE TEACHER
    $sql = 'INSERT INTO teacher (full_name, id_user) VALUES (:fn, :uid)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'fn' => $full_name,
        'uid' => $id_user
    ]);

    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Teacher created"]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

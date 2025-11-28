<?php

include "../config/db.php";

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

if (!$username || !$password) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$sql = 'SELECT * FROM "user" WHERE username = :u LIMIT 1';
$stmt = $pdo->prepare($sql);
$stmt->execute(["u" => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

if (!password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Incorrect password"]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $user["id_user"],
        "username" => $user["username"],
        "role" => $user["role"]
    ]
]);

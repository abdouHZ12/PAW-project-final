<?php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Collect fields
$full_name = $_POST['full_name'] ?? null;
$matricule  = $_POST['matricule'] ?? null;
$username   = $_POST['username'] ?? null;
$password   = $_POST['password'] ?? null;

// Check missing fields (simple, because you said no deep validation)
if (!$full_name || !$matricule || !$username || !$password) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

// Check if username already exists
$sql = 'SELECT id_user FROM "user" WHERE username = :u LIMIT 1';
$stmt = $pdo->prepare($sql);
$stmt->execute(["u" => $username]);

if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Username already taken"]);
    exit;
}

// Create hashed password
$hash = password_hash($password, PASSWORD_BCRYPT);

// INSERT into user table
$sql = 'INSERT INTO "user" (username, password, role)
        VALUES (:u, :p, :r)
        RETURNING id_user';

$stmt = $pdo->prepare($sql);

$stmt->execute([
    "u" => $username,
    "p" => $hash,
    "r" => "student"
]);

$user = $stmt->fetch();
$user_id = $user["id_user"];

// INSERT into student table
$sql = 'INSERT INTO student (full_name, matricule, id_user)
        VALUES (:fn, :m, :uid)';

$stmt = $pdo->prepare($sql);

$ok = $stmt->execute([
    "fn"  => $full_name,
    "m"   => $matricule,
    "uid" => $user_id
]);

if ($ok) {
    echo json_encode(["success" => true, "message" => "Student created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

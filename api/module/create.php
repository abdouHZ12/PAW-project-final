<?php
// api/module/create.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$module_name = trim($_POST['module_name'] ?? '');
$course_code  = trim($_POST['course_code'] ?? '');

if ($module_name === '' || $course_code === '') {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

try {
    // ensure unique course_code
    $stmt = $pdo->prepare("SELECT id_module FROM module WHERE course_code = :c LIMIT 1");
    $stmt->execute(['c' => $course_code]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Course code already used"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO module (module_name, course_code) VALUES (:n, :c)");
    $stmt->execute(['n' => $module_name, 'c' => $course_code]);
    echo json_encode(["success" => true, "message" => "Module created"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

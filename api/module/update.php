<?php
// api/module/update.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$id_module = $_POST['id_module'] ?? null;
$module_name = trim($_POST['module_name'] ?? '');
$course_code  = trim($_POST['course_code'] ?? '');

if (!$id_module || $module_name === '' || $course_code === '') {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

try {
    // unique course_code excluding current
    $stmt = $pdo->prepare("SELECT id_module FROM module WHERE course_code = :c AND id_module != :id LIMIT 1");
    $stmt->execute(['c' => $course_code, 'id' => $id_module]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Course code already used"]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE module SET module_name = :n, course_code = :c WHERE id_module = :id");
    $stmt->execute(['n' => $module_name, 'c' => $course_code, 'id' => $id_module]);
    echo json_encode(["success" => true, "message" => "Module updated"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

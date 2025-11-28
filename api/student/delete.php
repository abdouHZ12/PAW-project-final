<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "../../config/db.php";

$id_student = $_POST['id'];

if(!$id_student) {
    echo json_encode(["success" => false, "message" => "Missing required field: id"]);
    exit();
}

try {   
    $stmt = $pdo->prepare("DELETE FROM student WHERE id_student = :id");    
    $stmt->execute(["id" => $id_student]);
    echo json_encode(["success" => true, "message" => "Student deleted successfully"]);
}catch(Exception $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    exit();
}
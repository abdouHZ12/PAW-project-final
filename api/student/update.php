<?php

include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$id_student = $_POST['id_student'];
$full_name = $_POST['full_name'];
$matricule = $_POST['matricule'];

if(!$id_student || !$full_name || !$matricule) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$sql = " UPDATE student
         SET full_name = :fn,
             matricule = :mat
         WHERE id_student = :id";


$stmt = $pdo->prepare($sql);

$ok = $stmt ->execute([
    "fn"=>$full_name,
    "mat"=>$matricule,
    "id"=>$id_student
]);

if($ok){
    echo json_encode(["success"=>true , "message"=>"student update succesfully "]);

}   else{
    echo json_encode(["success" => false, "message" => "Database error"]);
}
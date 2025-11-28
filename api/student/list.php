<?php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$sql = "SELECT
            id_student,
            full_name,
            matricule
        FROM student
        ORDER BY  id_student DESC     
";

$stmt  = $pdo->prepare($sql);
$stmt->execute();


$students= $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success"=>true,
    "data"=>$students
]);
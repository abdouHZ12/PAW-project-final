<?php
// api/teachers/list.php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$sql = "
    SELECT t.id_teacher,
           t.full_name,
           u.username
    FROM teacher t
    LEFT JOIN \"user\" u ON t.id_user = u.id_user
    ORDER BY t.id_teacher DESC
";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $teachers
]);

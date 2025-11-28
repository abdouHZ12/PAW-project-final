<?php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$stmt = $pdo->prepare("SELECT id_group, group_name FROM groups ORDER BY group_name");
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["success" => true, "data" => $data]);

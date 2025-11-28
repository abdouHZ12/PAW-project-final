<?php
// api/session/update.php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$id_session = $_POST['id_session'] ?? null;
$id_teacher = $_POST['id_teacher'] ?? null;
$id_module  = $_POST['id_module'] ?? null;
$id_group   = $_POST['id_group'] ?? null;
$session_type = $_POST['session_type'] ?? null;
$session_date = $_POST['session_date'] ?? null;
$start_time = $_POST['start_time'] ?? null;
$end_time   = $_POST['end_time'] ?? null;

if (!$id_session || !$id_teacher || !$id_module || !$id_group || !$session_type || !$session_date || !$start_time || !$end_time) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

try {
    $sql = 'UPDATE session SET session_date = :date, start_time = :start, end_time = :endt,
            id_teacher = :tid, id_group = :gid, session_type = :type, id_module = :mid
            WHERE id_session = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'date' => $session_date,
        'start' => $start_time,
        'endt' => $end_time,
        'tid' => $id_teacher,
        'gid' => $id_group,
        'type' => $session_type,
        'mid' => $id_module,
        'id' => $id_session
    ]);
    echo json_encode(["success" => true, "message" => "Session updated"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

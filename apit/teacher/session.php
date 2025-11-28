<?php
// api/teacher/sessions.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$id_user = $_GET['id_user'] ?? null;
if (!$id_user) { echo json_encode(["success"=>false,"message"=>"Missing id_user"]); exit; }

try {
    // get teacher id
    $stmt = $pdo->prepare("SELECT id_teacher FROM teacher WHERE id_user = :u LIMIT 1");
    $stmt->execute(['u'=>$id_user]);
    $t = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$t) { echo json_encode(["success"=>false,"message"=>"Teacher not found"]); exit; }
    $id_teacher = $t['id_teacher'];

    $sql = "
      SELECT s.id_session, s.session_date,
             to_char(s.start_time,'HH24:MI') AS start_time,
             to_char(s.end_time,'HH24:MI') AS end_time,
             s.session_type,
             s.id_group, s.id_module,
             m.module_name,
             g.group_name
      FROM session s
      LEFT JOIN module m ON s.id_module = m.id_module
      LEFT JOIN \"groups\" g ON s.id_group = g.id_group
      WHERE s.id_teacher = :tid
      ORDER BY s.session_date DESC, s.start_time ASC
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['tid'=>$id_teacher]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success"=>true,"data"=>$rows]);
} catch(Exception $e){
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}

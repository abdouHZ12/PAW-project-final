<?php
// api/session/students.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$id_session = $_GET['id_session'] ?? null;
if (!$id_session) { echo json_encode(["success"=>false,"message"=>"Missing id_session"]); exit; }

try {
    // session info
    $stmt = $pdo->prepare("SELECT s.*, m.module_name, g.group_name,
        to_char(s.start_time,'HH24:MI') AS start_time, to_char(s.end_time,'HH24:MI') AS end_time
        FROM session s
        LEFT JOIN module m ON s.id_module = m.id_module
        LEFT JOIN \"groups\" g ON s.id_group = g.id_group
        WHERE s.id_session = :id LIMIT 1");
    $stmt->execute(['id'=>$id_session]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$session) { echo json_encode(["success"=>false,"message"=>"Session not found"]); exit; }

    // students of the group + whether they have an absence record for this session
    $sql = "SELECT st.id_student, st.full_name, st.matricule,
            CASE WHEN a.id_absence IS NOT NULL THEN 1 ELSE 0 END AS absent
            FROM student st
            LEFT JOIN absence a ON a.id_student = st.id_student AND a.id_session = :sid
            WHERE st.id_group = :gid
            ORDER BY st.full_name";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['sid'=>$id_session, 'gid'=>$session['id_group']]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success"=>true, "session"=>$session, "students"=>$students]);
} catch(Exception $e){
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}

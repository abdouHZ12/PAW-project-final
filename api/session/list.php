<?php
// api/session/list.php
include "../../config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$sql = '
    SELECT s.id_session,
           s.session_date,
           to_char(s.start_time, \'HH24:MI\') AS start_time,
           to_char(s.end_time, \'HH24:MI\') AS end_time,
           s.session_type,
           s.id_teacher,
           s.id_group,
           s.id_module,
           t.full_name AS teacher_name,
           m.module_name,
           g.group_name
    FROM session s
    LEFT JOIN teacher t ON s.id_teacher = t.id_teacher
    LEFT JOIN module m ON s.id_module = m.id_module
    LEFT JOIN "groups" g ON s.id_group = g.id_group
    ORDER BY s.session_date DESC, s.start_time ASC
';

$stmt = $pdo->prepare($sql);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "data" => $rows]);

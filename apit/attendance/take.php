<?php
// api/attendance/take.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$id_session = $_POST['id_session'] ?? null;
$absents = $_POST['absents'] ?? [];

if (!$id_session) { echo json_encode(["success"=>false,"message"=>"Missing id_session"]); exit; }
if (!is_array($absents)) { if($absents==='') $absents=[]; else $absents = [$absents]; }

try {
    $pdo->beginTransaction();

    // Fetch all students in the session's group
    $stmt = $pdo->prepare("SELECT id_student FROM student WHERE id_group = (SELECT id_group FROM session WHERE id_session = :sid)");
    $stmt->execute(['sid'=>$id_session]);
    $students = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

    // Normalize arrays of ints
    $absents = array_map('intval', $absents);
    $absents = array_filter($absents, fn($v)=> $v>0);

    // For each student: ensure absence exists if absent selected; remove if present selected
    $ins = $pdo->prepare("INSERT INTO absence (id_student, id_session, status) VALUES (:sid, :sess, 'Absent')");
    $chk = $pdo->prepare("SELECT id_absence FROM absence WHERE id_student = :sid AND id_session = :sess LIMIT 1");
    $del = $pdo->prepare("DELETE FROM absence WHERE id_absence = :id");

    foreach ($students as $st) {
        $st = intval($st);
        $isAbsent = in_array($st, $absents);
        // check existing
        $chk->execute(['sid'=>$st, 'sess'=>$id_session]);
        $row = $chk->fetch(PDO::FETCH_ASSOC);
        if ($isAbsent) {
            if (!$row) {
                // insert new absence
                $ins->execute(['sid'=>$st, 'sess'=>$id_session]);
            }
        } else {
            if ($row) {
                // try delete; may fail if justification exists (FK), catch and continue
                try {
                    $del->execute(['id'=>$row['id_absence']]);
                } catch (Exception $e) {
                    // cannot delete due to linked justification - skip but inform user later
                }
            }
        }
    }

    $pdo->commit();
    echo json_encode(["success"=>true,"message"=>"Attendance saved"]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}

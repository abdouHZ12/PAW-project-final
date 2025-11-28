<?php
// api/group/assign.php
include "../../config/db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$id_group = $_POST['id_group'] ?? null;
// students can be sent as array or as single value
$students = $_POST['students'] ?? [];

if (!$id_group) {
    echo json_encode(["success" => false, "message" => "Missing group id"]);
    exit;
}

// ensure students is an array of ints
if (!is_array($students)) {
    // if client sent empty string or single value
    if ($students === '') $students = [];
    else $students = [$students];
}

try {
    $pdo->beginTransaction();

    // Unassign all students currently in this group (so checked set becomes authoritative)
    $stmt = $pdo->prepare('UPDATE student SET id_group = NULL WHERE id_group = :gid');
    $stmt->execute(['gid' => $id_group]);

    // Assign selected students
    $stmt = $pdo->prepare('UPDATE student SET id_group = :gid WHERE id_student = :sid');
    foreach ($students as $sid) {
        $sid = intval($sid);
        if ($sid <= 0) continue;
        $stmt->execute(['gid' => $id_group, 'sid' => $sid]);
    }

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Students assigned"]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

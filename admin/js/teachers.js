$(document).ready(function () {

    // load on start
    loadTeachers();

    // open create modal
    $("#btn-open-create-teacher").on("click", function () {
        $("#create-teacher-modal").removeClass("hidden");
    });

    // close create modal
    $("#close-create-teacher").on("click", function () {
        $("#create-teacher-modal").addClass("hidden");
        $("#create-teacher-form")[0].reset();
    });

    // submit create form
    $("#create-teacher-form").on("submit", function (e) {
        e.preventDefault();

        let data = {
            full_name: $("#teacher_full_name").val(),
            username: $("#teacher_username").val(),
            password: $("#teacher_password").val()
        };

        $.ajax({
            url: "http://localhost:8000/api/teacher/create.php",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    alert("Teacher created");
                    $("#create-teacher-modal").addClass("hidden");
                    $("#create-teacher-form")[0].reset();
                    loadTeachers();
                } else {
                    alert(res.message);
                }
            },
            error: function () {
                alert("Server error creating teacher");
            }
        });
    });

    // open edit modal (delegated)
    $(document).on("click", ".btn-edit-teacher", function () {
        const id = $(this).data("id");
        const fullname = $(this).data("fullname");
        const username = $(this).data("username");

        $("#edit_teacher_id").val(id);
        $("#edit_teacher_full_name").val(fullname);
        $("#edit_teacher_username").val(username);

        $("#edit-teacher-modal").removeClass("hidden");
    });

    // close edit modal
    $("#close-edit-teacher").on("click", function () {
        $("#edit-teacher-modal").addClass("hidden");
        $("#edit-teacher-form")[0].reset();
    });

    // submit edit form
    $("#edit-teacher-form").on("submit", function (e) {
        e.preventDefault();

        let data = {
            id_teacher: $("#edit_teacher_id").val(),
            full_name: $("#edit_teacher_full_name").val(),
            username: $("#edit_teacher_username").val()
        };

        $.ajax({
            url: "http://localhost:8000/api/teacher/update.php",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    alert("Teacher updated");
                    $("#edit-teacher-modal").addClass("hidden");
                    loadTeachers();
                } else {
                    alert(res.message);
                }
            },
            error: function () {
                alert("Server error while updating teacher");
            }
        });
    });

    // delete teacher (delegated)
    $(document).on("click", ".btn-delete-teacher", function () {
        const id = $(this).data("id");
        if (!confirm("Delete this teacher?")) return;

        $.ajax({
            url: "http://localhost:8000/api/teacher/delete.php",
            type: "POST",
            data: { id_teacher: id },
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    alert("Teacher deleted");
                    loadTeachers();
                } else {
                    alert(res.message);
                }
            },
            error: function () {
                alert("Server error while deleting teacher");
            }
        });
    });

    // load teachers
    function loadTeachers() {
        $.ajax({
            url: "http://localhost:8000/api/teacher/list.php",
            type: "GET",
            dataType: "json",


            success: function (res) {
                if (!res.success) {
                    alert("Failed to load teachers");
                    return;
                }

                let html = "";
                res.data.forEach(t => {
                    html += `
                    <tr>
                        <td>${t.id_teacher}</td>
                        <td>${escapeHtml(t.full_name)}</td>
                        <td>${escapeHtml(t.username || "")}</td>
                        <td>
                            <button class="btn-edit-teacher"
                                data-id="${t.id_teacher}"
                                data-fullname="${escapeAttr(t.full_name)}"
                                data-username="${escapeAttr(t.username || '')}">
                                Edit
                            </button>

                            <button class="btn-delete-teacher" data-id="${t.id_teacher}">
                                Delete
                            </button>
                        </td>
                    </tr>`;
                });

                $("#teachers-body").html(html);
            },
            error: function () {
                alert("Server error while loading teachers");
            }
        });
    }

    // small helper to avoid breaking HTML when names contain quotes
    function escapeAttr(s) {
        if (!s) return "";
        return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function escapeHtml(s) {
        if (!s) return "";
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

});

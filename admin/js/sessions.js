// admin/js/sessions.js
$(document).ready(function () {

    // load initial lists for selects and table
    loadDropdowns();
    loadSessions();

    // open create modal
    $("#btn-open-create-session").on("click", function () {
        $("#create-session-modal").removeClass("hidden");
    });

    // close create
    $("#cancel-create-session").on("click", function () {
        $("#create-session-modal").addClass("hidden");
        $("#create-session-form")[0].reset();
    });

    // close edit
    $("#cancel-edit-session").on("click", function () {
        $("#edit-session-modal").addClass("hidden");
        $("#edit-session-form")[0].reset();
    });

    // Create session
    $("#create-session-form").on("submit", function (e) {
        e.preventDefault();
        let data = {
            id_teacher: $("#create_teacher").val(),
            id_module: $("#create_module").val(),
            id_group: $("#create_group").val(),
            session_type: $("#create_type").val(),
            session_date: $("#create_date").val(),
            start_time: $("#create_start").val(),
            end_time: $("#create_end").val()
        };

        $.ajax({
            url: "http://localhost:8000/api/session/create.php",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    alert("Session created");
                    $("#create-session-modal").addClass("hidden");
                    loadSessions();
                } else alert(res.message);
            },
            error: function () { alert("Server error"); }
        });
    });

    // Edit button click
    $(document).on("click", ".btn-edit-session", function () {
        const id = $(this).data("id");

        // fetch single session? we have data attributes, but we'll call list and find it
        $.getJSON("http://localhost:8000/api/session/list.php", function (res) {
            if (!res.success) { alert("Failed"); return; }
            const session = res.data.find(s => parseInt(s.id_session) === parseInt(id));
            if (!session) { alert("Session not found"); return; }

            $("#edit_id").val(session.id_session);
            $("#edit_teacher").val(session.id_teacher);
            $("#edit_module").val(session.id_module);
            $("#edit_group").val(session.id_group);
            $("#edit_type").val(session.session_type);
            $("#edit_date").val(session.session_date);
            $("#edit_start").val(session.start_time);
            $("#edit_end").val(session.end_time);

            $("#edit-session-modal").removeClass("hidden");
        });
    });

    // Submit edit
    $("#edit-session-form").on("submit", function (e) {
        e.preventDefault();
        const data = {
            id_session: $("#edit_id").val(),
            id_teacher: $("#edit_teacher").val(),
            id_module: $("#edit_module").val(),
            id_group: $("#edit_group").val(),
            session_type: $("#edit_type").val(),
            session_date: $("#edit_date").val(),
            start_time: $("#edit_start").val(),
            end_time: $("#edit_end").val()
        };

        $.ajax({
            url: "http://localhost:8000/api/session/update.php",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    alert("Session updated");
                    $("#edit-session-modal").addClass("hidden");
                    loadSessions();
                } else alert(res.message);
            }
        });
    });

    // Delete
    $(document).on("click", ".btn-delete-session", function () {
        const id = $(this).data("id");
        if (!confirm("Delete this session?")) return;

        $.post("http://localhost:8000/api/session/delete.php", { id_session: id }, function (res) {
            if (res.success) {
                alert("Deleted");
                loadSessions();
            } else alert(res.message);
        }, "json");
    });

    // load dropdowns (teachers, modules, groups)
    function loadDropdowns() {
        $.getJSON("http://localhost:8000/api/teacher/list.php", function (tres) {
            let html = '<option value="">-- Select teacher --</option>';
            if (tres.success) {
                tres.data.forEach(t => {
                    html += `<option value="${t.id_teacher}">${escapeHtml(t.full_name || t.username)}</option>`;
                });
            }
            $("#create_teacher, #edit_teacher").html(html);
        });

        $.getJSON("http://localhost:8000/api/module/list.php", function (mres) {
            let html = '<option value="">-- Select module --</option>';
            if (mres.success) {
                mres.data.forEach(m => {
                    html += `<option value="${m.id_module}">${escapeHtml(m.module_name)}</option>`;
                });
            }
            $("#create_module, #edit_module").html(html);
        });

        $.getJSON("http://localhost:8000/api/group/list.php", function (gres) {
            let html = '<option value="">-- Select group --</option>';
            if (gres.success) {
                gres.data.forEach(g => {
                    html += `<option value="${g.id_group}">${escapeHtml(g.group_name)}</option>`;
                });
            }
            $("#create_group, #edit_group").html(html);
        });
    }

    // load sessions table
    function loadSessions() {
        $.getJSON("http://localhost:8000/api/session/list.php", function (res) {
            if (!res.success) {
                alert("Failed to load sessions");
                return;
            }
            let html = "";
            res.data.forEach(s => {
                // time format start-end
                let timeRange = (s.start_time && s.end_time) ? `${s.start_time}–${s.end_time}` : "";
                html += `<tr>
                    <td>${escapeHtml(s.teacher_name || "")}</td>
                    <td>${escapeHtml(s.module_name || "")}</td>
                    <td>${escapeHtml(s.group_name || "")}</td>
                    <td>${escapeHtml(s.session_type || "")}</td>
                    <td>${escapeHtml(timeRange)}</td>
                    <td>${escapeHtml(s.session_date || "")}</td>
                    <td>
                        <button class="action-btn edit-btn btn-edit-session" data-id="${s.id_session}">Edit</button>
                        <button class="action-btn delete-btn btn-delete-session" data-id="${s.id_session}">Delete</button>
                    </td>
                </tr>`;
            });
            $("#sessions-body").html(html);
        });
    }

    // helpers
    function escapeHtml(s) {
        if (!s) return "";
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

});

// admin/js/groups.js
$(function () {
  // initial load
  loadGroups();

  // open create modal
  $("#btn-open-create-group").on("click", function () {
    $("#create-group-modal").removeClass("hidden");
  });

  // close create
  $("#close-create-group, #cancel-create-group").on("click", function () {
    $("#create-group-modal").addClass("hidden");
    $("#create-group-form")[0].reset();
  });

  // create group submit
  $("#create-group-form").on("submit", function (e) {
    e.preventDefault();
    const name = $("#create_group_name").val().trim();
    if (!name) return alert("Enter group name");

    $.post("http://localhost:8000/api/group/create.php", { group_name: name }, function (res) {
      if (res.success) {
        $("#create-group-modal").addClass("hidden");
        $("#create-group-form")[0].reset();
        loadGroups();
      } else alert(res.message || "Error creating group");
    }, "json").fail(()=> alert("Server error"));
  });

  // close edit
  $("#close-edit-group, #cancel-edit-group").on("click", function () {
    $("#edit-group-modal").addClass("hidden");
    $("#edit-group-form")[0].reset();
  });

  // edit submit
  $("#edit-group-form").on("submit", function (e) {
    e.preventDefault();
    const id = $("#edit_group_id").val();
    const name = $("#edit_group_name").val().trim();
    if (!name) return alert("Enter group name");

    $.post("http://localhost:8000/api/group/update.php", { id_group: id, group_name: name }, function (res) {
      if (res.success) {
        $("#edit-group-modal").addClass("hidden");
        loadGroups();
      } else alert(res.message || "Error updating group");
    }, "json").fail(()=> alert("Server error"));
  });

  // assign modal close
  $("#close-assign, #cancel-assign").on("click", function () {
    $("#assign-students-modal").addClass("hidden");
    $("#students-list").empty();
  });

  // save assign
  $("#save-assign").on("click", function () {
    const gid = $("#save-assign").data("group");
    if (!gid) return alert("Group missing");
    // collect checked
    const students = [];
    $("#students-list input[type=checkbox]:checked").each(function () {
      students.push($(this).val());
    });

    // if none selected, confirm clearing? we'll allow 0 -> unassign
    $.ajax({
      url: "http://localhost:8000/api/group/assign.php",
      type: "POST",
      dataType: "json",
      data: { id_group: gid, students: students },
      success: function (res) {
        if (res.success) {
          alert("Assignments saved");
          $("#assign-students-modal").addClass("hidden");
          loadGroups();
        } else alert(res.message || "Error saving assignments");
      },
      error: function () { alert("Server error"); }
    });
  });

  // delegated actions from card buttons
  $("#groups-grid").on("click", ".btn-edit-group", function () {
    const id = $(this).data("id");
    const name = $(this).data("name");
    $("#edit_group_id").val(id);
    $("#edit_group_name").val(name);
    $("#edit-group-modal").removeClass("hidden");
  });

  $("#groups-grid").on("click", ".btn-delete-group", function () {
    const id = $(this).data("id");
    if (!confirm("Delete this group?")) return;
    $.post("http://localhost:8000/api/group/delete.php", { id_group: id }, function (res) {
      if (res.success) loadGroups(); else alert(res.message || "Delete failed");
    }, "json").fail(()=> alert("Server error"));
  });

  // open assign modal
  $("#groups-grid").on("click", ".btn-assign-group", function () {
    const id = $(this).data("id");
    const name = $(this).data("name");
    $("#assign-info").text(`Assign students to "${name}"`);
    $("#save-assign").data("group", id);
    // load students list
    loadStudentsForAssign(id);
    $("#assign-students-modal").removeClass("hidden");
  });

  // load groups and render cards
  function loadGroups() {
    $.getJSON("http://localhost:8000/api/group/list.php", function (res) {
      if (!res.success) { $("#groups-grid").html("<p>Failed to load groups</p>"); return; }
      const rows = res.data || [];
      if (rows.length === 0) {
        $("#groups-grid").html('<div class="no-groups">No groups yet. Click "Add Group".</div>');
        return;
      }
      let html = "";
      rows.forEach(g => {
        html += `<div class="group-card">
            <div>
              <div class="group-name">${escape(g.group_name)}</div>
            </div>
            <div class="group-actions">
              <button class="assign-btn btn-assign-group" data-id="${g.id_group}" data-name="${escapeAttr(g.group_name)}">Assign</button>
              <button class="edit-btn btn-edit-group" data-id="${g.id_group}" data-name="${escapeAttr(g.group_name)}">Edit</button>
              <button class="delete-btn btn-delete-group" data-id="${g.id_group}">Delete</button>
            </div>
          </div>`;
      });
      $("#groups-grid").html(html);
    }).fail(()=> $("#groups-grid").html("<p>Server error</p>"));
  }

  // load students and show checkbox list, mark checked if already in group
  function loadStudentsForAssign(groupId) {
    // load all students with their id_group
    $.getJSON("http://localhost:8000/api/student/list.php", function (res) {
      if (!res.success) { $("#students-list").html("<p>Failed to load students</p>"); return; }
      const students = res.data || [];
      let html = "";
      students.forEach(s => {
        const checked = (s.id_group && parseInt(s.id_group) === parseInt(groupId)) ? "checked" : "";
        html += `<label class="student-row">
                  <input type="checkbox" value="${s.id_student}" ${checked}>
                  <div>
                    <div style="font-weight:600;">${escape(s.full_name || s.matricule)}</div>
                    <div style="font-size:13px;color:#6b7280;">${escape(s.matricule || "")}</div>
                  </div>
                </label>`;
      });
      $("#students-list").html(html);
    }).fail(()=> $("#students-list").html("<p>Server error</p>"));
  }

  // helpers
  function escape(s) {
    if (!s) return "";
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function escapeAttr(s) {
    if (!s) return "";
    return String(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
});

// admin/js/modules.js
$(function () {
  loadModules();

  // open create modal
  $("#btn-open-create-module").on("click", function () {
    $("#create-module-modal").removeClass("hidden");
  });

  // close create
  $("#close-create-module, #cancel-create-module").on("click", function () {
    $("#create-module-modal").addClass("hidden");
    $("#create-module-form")[0].reset();
  });

  // create submit
  $("#create-module-form").on("submit", function (e) {
    e.preventDefault();
    const name = $("#create_module_name").val().trim();
    const code = $("#create_course_code").val().trim();
    if (!name || !code) return alert("Fill both fields");

    $.post("http://localhost:8000/api/module/create.php", { module_name: name, course_code: code }, function (res) {
      if (res.success) {
        $("#create-module-modal").addClass("hidden");
        $("#create-module-form")[0].reset();
        loadModules();
      } else {
        alert(res.message || "Error creating module");
      }
    }, "json").fail(()=> alert("Server error"));
  });

  // open edit
  $("#modules-grid").on("click", ".btn-edit-module", function () {
    const id = $(this).data("id");
    const name = $(this).data("name");
    const code = $(this).data("code");
    $("#edit_module_id").val(id);
    $("#edit_module_name").val(name);
    $("#edit_course_code").val(code);
    $("#edit-module-modal").removeClass("hidden");
  });

  // close edit
  $("#close-edit-module, #cancel-edit-module").on("click", function () {
    $("#edit-module-modal").addClass("hidden");
    $("#edit-module-form")[0].reset();
  });

  // submit edit
  $("#edit-module-form").on("submit", function (e) {
    e.preventDefault();
    const id = $("#edit_module_id").val();
    const name = $("#edit_module_name").val().trim();
    const code = $("#edit_course_code").val().trim();
    if (!id || !name || !code) return alert("Missing fields");

    $.post("http://localhost:8000/api/module/update.php", { id_module: id, module_name: name, course_code: code }, function (res) {
      if (res.success) {
        $("#edit-module-modal").addClass("hidden");
        loadModules();
      } else alert(res.message || "Update error");
    }, "json").fail(()=> alert("Server error"));
  });

  // delete
  $("#modules-grid").on("click", ".btn-delete-module", function () {
    const id = $(this).data("id");
    if (!confirm("Delete this module?")) return;
    $.post("http://localhost:8000/api/module/delete.php", { id_module: id }, function (res) {
      if (res.success) loadModules(); else alert(res.message || "Delete failed");
    }, "json").fail(()=> alert("Server error"));
  });

  // load modules and render cards
  function loadModules() {
    $.getJSON("http://localhost:8000/api/module/list.php", function (res) {
      if (!res.success) { $("#modules-grid").html("<p>Failed to load modules</p>"); return; }
      const rows = res.data || [];
      if (rows.length === 0) {
        $("#modules-grid").html('<div class="no-modules">No modules yet. Click "Add Module".</div>');
        return;
      }
      let html = "";
      rows.forEach(m => {
        html += `<div class="module-card">
            <div>
              <div class="module-name">${escape(m.module_name)}</div>
              <div class="module-code">${escape(m.course_code || '')}</div>
            </div>
            <div class="module-actions">
              <button class="edit-btn btn-edit-module" data-id="${m.id_module}" data-name="${escapeAttr(m.module_name)}" data-code="${escapeAttr(m.course_code)}">Edit</button>
              <button class="delete-btn btn-delete-module" data-id="${m.id_module}">Delete</button>
            </div>
          </div>`;
      });
      $("#modules-grid").html(html);
    }).fail(()=> $("#modules-grid").html("<p>Server error</p>"));
  }

  // helpers
  function escape(s){ if (!s) return ""; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function escapeAttr(s){ if (!s) return ""; return String(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
});

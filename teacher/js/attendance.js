// teacher/js/attendance.js
$(function(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) { window.location.href = "../../public/index.html"; return; }

  const params = new URLSearchParams(window.location.search);
  const id_session = params.get("id_session");
  if (!id_session) { alert("Missing session"); window.location.href = "sessions.html"; }

  $("#back-btn").on("click", () => window.history.back() );

  loadSessionStudents(id_session);

  function loadSessionStudents(sid){
    $.getJSON("http://localhost:8000/apit/session/students.php", { id_session: sid }, function(res){
      if (!res.success) { $("#msg").text(res.message || "Failed to load"); return; }
      const info = res.session;
      $("#session-info").html(`
        <div><strong>Module:</strong> ${escape(info.module_name || '')}</div>
        <div><strong>Group:</strong> ${escape(info.group_name || '')}</div>
        <div><strong>Date:</strong> ${escape(info.session_date || '')}</div>
        <div><strong>Time:</strong> ${escape(info.start_time || '')}–${escape(info.end_time || '')}</div>
        <hr>
      `);

      const students = res.students || [];
      if (students.length === 0) {
        $("#students-area").html("<p>No students in this group.</p>");
        return;
      }
      let html = '<div class="students-list">';
      students.forEach(st => {
        const checked = st.absent ? "checked" : "";
        html += `
          <label class="student-row">
            <input type="checkbox" class="absent-checkbox" value="${st.id_student}" ${checked}> 
            <span class="student-name">${escape(st.full_name || st.matricule || '')}</span>
            <span class="student-mat">${escape(st.matricule || '')}</span>
          </label>
        `;
      });
      html += '</div>';
      $("#students-area").html(html);
    }).fail(()=> $("#msg").text("Server error"));
  }

  $("#attendance-form").on("submit", function(e){
    e.preventDefault();
    const absents = [];
    $(".absent-checkbox:checked").each(function(){ absents.push($(this).val()); });

    $.ajax({
      url: "http://localhost:8000/apit/attendance/take.php",
      type: "POST",
      dataType: "json",
      data: { id_session: id_session, absents: absents },
      success: function(res){
        if (res.success) {
          alert("Attendance saved");
          loadSessionStudents(id_session); // refresh
        } else {
          alert(res.message || "Save failed");
        }
      },
      error: function(){ alert("Server error"); }
    });
  });

  function escape(s){ if (!s) return ""; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
});

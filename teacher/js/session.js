// teacher/js/sessions.js
$(function(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) { window.location.href = "../../public/index.html"; return; }

  loadSessions();

  function loadSessions(){
    $.getJSON("http://localhost:8000/apit/teacher/session.php", { id_user: user.id }, function(res){
      if (!res.success) { $("#sessions-list").html("<p>Error loading sessions</p>"); return; }
      const rows = res.data || [];
      if (rows.length === 0) {
        $("#sessions-list").empty(); $("#no-sessions").show(); return;
      }
      $("#no-sessions").hide();
      let html = "";
      rows.forEach(s => {
        const timeRange = (s.start_time && s.end_time) ? `${s.start_time}–${s.end_time}` : "";
        html += `
          <div class="session-card">
            <div class="session-main">
              <div class="session-row"><strong>Module:</strong> ${escape(s.module_name || '')}</div>
              <div class="session-row"><strong>Group:</strong> ${escape(s.group_name || '')}</div>
              <div class="session-row"><strong>Type:</strong> ${escape(s.session_type || '')}</div>
              <div class="session-row"><strong>Date:</strong> ${escape(s.session_date || '')}</div>
              <div class="session-row"><strong>Time:</strong> ${escape(timeRange)}</div>
            </div>
            <div class="session-actions">
              <button class="btn-attend" data-id="${s.id_session}">Take Attendance</button>
            </div>
          </div>
        `;
      });
      $("#sessions-list").html(html);
    }).fail(()=> $("#sessions-list").html("<p>Server error</p>"));
  }

  // open attendance page
  $("#sessions-list").on("click", ".btn-attend", function(){
    const id = $(this).data("id");
    window.location.href = `pages/attendance.html?id_session=${id}`;
  });

  function escape(s){ if (!s) return ""; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
});

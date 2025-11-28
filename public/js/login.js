document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:8000/auth/login.php", {
        method: "POST",
        body: new URLSearchParams({ username, password })
    });

    const data = await res.json();

    if (!data.success) {
        document.getElementById("error").innerText = data.message;
        return;
    }

    // Save locally (simple session)
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "admin") {
    window.location.href = "../admin/pages/admin.html";

} else if (data.user.role === "teacher") {
    window.location.href = "../teacher/index.html";
}

});

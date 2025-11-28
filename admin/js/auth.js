// auth.js
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "../../public/index.html";
}

function requireRole(role) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== role) {
        window.location.href = "../../public/index.html"; 
    }
}

// teacher/js/teacher.js
$(document).ready(function () {

    // Sidebar active highlight
    $(".menu li").on("click", function () {
        $(".menu li").removeClass("active");
        $(this).addClass("active");

        let page = $(this).data("page");
        if (page) $("#content-area").load(`pages/${page}.html`);
    });

    // Logout
    $(".logout-btn").on("click", function () {
        localStorage.removeItem("user");
        window.location.href = "../../public/index.html";
    });

});

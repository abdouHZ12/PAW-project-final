$(document).ready(function () {

    // Sidebar active underline
    $(".menu li").on("click", function () {
        // Remove active from all
        $(".menu li").removeClass("active");

        // Add active to clicked
        $(this).addClass("active");

        // Load page
        let page = $(this).data("page");
        if (page) $("#content-area").load(`../pages/${page}.html`);
    });

    // Logout (later implement PHP)
    $(".logout-btn").on("click", function () {
        alert("Logged out!");
        window.location.href = "../../public/index.html";
    });

});

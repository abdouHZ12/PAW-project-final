$(document).ready(function () {

    loadStudents();


    // OPEN CREATE MODAL
    $("#btn-open-create").click(function () {
        $("#create-student-modal").removeClass("hidden");
    });

    // CLOSE CREATE MODAL
    $("#close-create").click(function () {
        $("#create-student-modal").addClass("hidden");
        $("#create-student-form")[0].reset();
    });

    // SUBMIT CREATE FORM
    $("#create-student-form").submit(function (e) {
        e.preventDefault();

        let formData = new FormData(this);

        $.ajax({
            url: "http://localhost:8000/api/student/create.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    alert("Student created!");
                    $("#create-student-modal").addClass("hidden");
                    loadStudents();
                } else {
                    alert(res.message);
                }
            }
        });

    });


// DELETE STUDENT
$(document).on("click", ".btn-delete", function () {
    const id = $(this).data("id");

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    $.ajax({
        url: "http://localhost:8000/api/student/delete.php",
        type: "POST",
        data: { id: id },
        success: function (response) {
            if (response.success) {
                alert("Student deleted!");
                loadStudents(); 
            } else {
                alert("Error: " + response.message);
            }
        }
    });
});


    // SUBMIT EDIT FORM
    $("#edit-student-form").submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: "http://localhost:8000/api/student/update.php",
            type: "POST",
            data: { 
                id_student: $("#edit_id").val(),
                full_name: $("#edit_full_name").val(),
                matricule: $("#edit_matricule").val()
            },
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    alert("Student updated!");
                    $("#edit-student-modal").addClass("hidden");
                    loadStudents();
                } else {
                    alert(res.message);
                }
            }
        });
    });





    // OPEN EDIT MODAL
    $(document).on("click", ".btn-edit", function () {

        $("#edit_id").val($(this).data("id"));
        $("#edit_full_name").val($(this).data("fullname"));
        $("#edit_matricule").val($(this).data("matricule"));

        $("#edit-student-modal").removeClass("hidden");
    });

    // CLOSE EDIT MODAL
    $("#close-edit").click(function () {
        $("#edit-student-modal").addClass("hidden");
    });


    // LOAD STUDENTS
    function loadStudents() {
    $.ajax({
        url: "http://localhost:8000/api/student/list.php",  
        type: "GET",
        dataType: "json",

        success: function (response) {

            if (!response.success) {
                alert("Failed to load students.");
                return;
            }

            let tbody = "";

            response.data.forEach(s => {
                tbody += `
                    <tr>
                        <td>${s.id_student}</td>
                        <td>${s.full_name}</td>
                        <td>${s.matricule}</td>

                        <td>
                            <button class="btn-edit"
                                data-id="${s.id_student}"
                                data-fullname="${s.full_name}"
                                data-matricule="${s.matricule}">
                                Edit
                            </button>

                            <button class="btn-delete"
                                data-id="${s.id_student}">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });

            $("#students-body").html(tbody);
        },

        error: function (xhr, status, error) {
                console.error("Error loading students:", error);
                alert("Failed to load students. Check console for details.");
            }
    });
}

});

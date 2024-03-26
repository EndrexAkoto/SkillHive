// Wait for the DOM to be loaded
$(document).ready(function () {
    // Add event listener to the login button
    $("#loginButton").click(function () {
        // Show the login modal
        $("#loginModal").modal("show");
    });

    // Form submission
    $("#loginForm").submit(function (e) {
        // Prevent the default form submission
        e.preventDefault();

        const email = $("#email").val();
        const password = $("#password").val();

        // Implement your validation logic here
        if (email.trim() && password.trim()) {
            // For demonstration, just log the credentials
            console.log("Email:", email, "Password:", password);
            // Here you would typically send the credentials to the server
            // For example, using fetch() or XMLHttpRequest

            // Close the modal after submission (optional)
            $("#loginModal").modal("hide");
        } else {
            alert("Please fill in both fields.");
        }
    });
});

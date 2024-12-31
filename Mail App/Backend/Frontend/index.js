// Main Menu Page Logic
// Main Menu Page Logic
if (window.location.pathname === "/" || window.location.pathname === "/main.html") {
    document.getElementById("sendEmailBtn").addEventListener("click", () => {
        window.location.href = "/send-email"; // Match server route
    });

    document.getElementById("viewSentEmailsBtn").addEventListener("click", () => {
        window.location.href = "/sent-emails"; // Match server route
    });
}

// Send Email Page Logic
// Send Email Page Logic
if (window.location.pathname === "/send-email" || window.location.pathname === "/sendEmail.html") {
    document.getElementById("mailForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailData = {
            smtp: document.getElementById("smtp").value,
            port: parseInt(document.getElementById("port").value),
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            recipient: document.getElementById("recipient").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value,
        };

        const response = await fetch("/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailData),
        });

        const result = await response.json();
        alert(result.message);
    });

    document.getElementById("menuBtn").addEventListener("click", () => {
        window.location.href = "/"; // Back to main.html
    });
}


// Sent Emails Page Logic
// Sent Emails Page Logic
if (window.location.pathname === "/sent-emails" || window.location.pathname === "/sentEmails.html") {
    console.log("Sent Emails page loaded");

    // Fetch sent emails from the server
    fetch("/api/sent-emails")
        .then((res) => res.json())
        .then((data) => {
            console.log("Fetched sent emails:", data);
            const sentEmailsTable = document.querySelector("#sentEmailsTable tbody"); // Target tbody
            sentEmailsTable.innerHTML = "";

            data.forEach((email, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${email.sender}</td>
                        <td>${email.recipient}</td>
                        <td>${email.date}</td>
                    </tr>`;
                sentEmailsTable.innerHTML += row;
            });
        })
        .catch((error) => console.error("Error fetching sent emails:", error));

    // Back to Main Menu button
    document.getElementById("menuBtnBottom").addEventListener("click", () => {
        console.log("Back to menu button clicked");
        window.location.href = "/";
    });
}


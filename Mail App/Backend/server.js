const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = 3000;

const sentEmails = []; // To store sent email records

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/Frontend"))); // Serve static files like CSS, images, etc.

// Routes for serving HTML files
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/Frontend/main.html")); // Serve the main menu
});

app.get("/send-email", (req, res) => {
    res.sendFile(path.join(__dirname, "/Frontend/sendEmail.html")); // Serve the send email form
});

app.get("/sent-emails", (req, res) => {
    res.sendFile(path.join(__dirname, "/Frontend/sentEmails.html")); // Serve the sent emails page
});

// Endpoint to handle email sending
app.post("/send-email", async (req, res) => {
    const { smtp, port, email, password, recipient, subject, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: smtp,               // SMTP server (e.g., smtp.gmail.com)
            port: parseInt(port),     // Port number (465 for SSL, 587 for TLS)
            secure: port === 465,     // true for SSL, false for TLS
            auth: {
                user: email,          // Sender's email address
                pass: password,       // Sender's app password
            },
        });

        // Verify the transporter configuration
        await transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP Verification Failed:", error.message);
                res.json({ success: false, message: "SMTP Verification Failed", error: error.message });
                return;
            }
            console.log("SMTP Server is Ready:", success);
        });

        const mailOptions = {
            from: email,       // Sender's email address
            to: recipient,     // Recipient's email address
            subject: subject,  // Email subject
            text: message,     // Email message content
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error.message);
                res.json({ success: false, message: "Failed to Send Email", error: error.message });
            } else {
                console.log("Email sent successfully:", info.response);

                // Save the sent email record
                const emailRecord = {
                    sender: email,
                    recipient: recipient,
                    date: new Date().toLocaleString(),
                };
                sentEmails.push(emailRecord);

                res.json({ success: true, message: "Email Sent Successfully!" });
            }
        });
    } catch (error) {
        console.error("Unexpected Error:", error.message);
        res.json({ success: false, message: "An Unexpected Error Occurred", error: error.message });
    }
});

// Endpoint to fetch sent emails
app.get("/api/sent-emails", (req, res) => {
    res.json(sentEmails); // Return the sent emails as JSON
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = 3000;

const sentEmails = []; 

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); 

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html")); 
});

app.get("/send-email", (req, res) => {
    res.sendFile(path.join(__dirname, "sendEmail.html")); 
});

app.get("/sent-emails", (req, res) => {
    res.sendFile(path.join(__dirname, "sentEmails.html")); 
});

app.post("/send-email", async (req, res) => {
    const { smtp, port, email, password, recipient, subject, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: smtp,               
            port: parseInt(port),     
            secure: port === 465,     
            auth: {
                user: email,         
                pass: password,       
            },
        });

        await transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP Verification Failed:", error.message);
                res.json({ success: false, message: "SMTP Verification Failed", error: error.message });
                return;
            }
            console.log("SMTP Server is Ready:", success);
        });

        const mailOptions = {
            from: email,       
            to: recipient,     
            subject: subject,  
            text: message,     
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error.message);
                res.json({ success: false, message: "Failed to Send Email", error: error.message });
            } else {
                console.log("Email sent successfully:", info.response);

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

app.get("/api/sent-emails", (req, res) => {
    res.json(sentEmails); 
});

app.listen(PORT, () => {
    console.log(`Server is ready to run on http://localhost:${PORT}`);
});

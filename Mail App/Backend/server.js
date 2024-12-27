const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'Frontend' folder
app.use(express.static(path.join(__dirname, 'Frontend')));

// Endpoint for sending emails
app.post('/send-email', async (req, res) => {
    const { email, smtp, password, recipient, subject, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: smtp,
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass: password,
            },
        });

        const mailOptions = {
            from: email,
            to: recipient,
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email Sent Successfully!" });
    } catch (error) {
        res.json({ success: false, message: "Email Not Sent", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

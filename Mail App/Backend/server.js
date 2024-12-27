const express = require('express');
const bodyParser = require('body-parser');
const mailjet = require('node-mailjet');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint for sending emails
app.post('/send-email', async (req, res) => {
    const { email, recipient, subject, message } = req.body;

    // Replace with your Mailjet API Key and Secret Key
    const API_KEY = 'e53d3f873c1153a4fc9abbb0c946ae55';
    const SECRET_KEY = 'b07b33871d5d097b81558b1d1882ee94';

    try {
        const mj = mailjet.connect(API_KEY, SECRET_KEY);
        const request = await mj.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: email,
                        Name: 'Mail App',
                    },
                    To: [
                        {
                            Email: recipient,
                            Name: 'Recipient',
                        },
                    ],
                    Subject: subject,
                    TextPart: message,
                },
            ],
        });

        res.json({ success: true, message: 'Email sent successfully', response: request.body });
    } catch (error) {
        res.json({ success: false, message: 'Email not sent', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

document.getElementById('mailForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailData = {
        email: document.getElementById('email').value,
        recipient: document.getElementById('recipient').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
    };

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Sending email...';

    try {
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData),
        });

        const result = await response.json();

        if (result.success) {
            resultDiv.textContent = 'Email sent successfully!';
        } else {
            resultDiv.textContent = `Failed to send email: ${result.message}`;
        }
    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
    }
});

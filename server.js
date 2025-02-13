const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));  // Serve static files
app.use(express.urlencoded({ extended: true }));  // Handle form data

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`New Contact Submission:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    res.send('Thank you for reaching out! We will contact you soon.');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


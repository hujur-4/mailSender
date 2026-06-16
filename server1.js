require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve HTML/CSS files

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configure the Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST Route to handle form submission
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
        to: email,
        replyTo: process.env.EMAIL_USER,
    
        subject: `Message from ${name}`,
    
        text: `
    Hello ${name},
    
    Thank you for contacting us.
    
    Your details:
    
    Name: ${name}
    Email: ${email}
    
    Message:
    ${message}
    
    Regards,
    Website Team
        `,
    
        html: `
            <div style="font-family: Arial, sans-serif; line-height:1.5;">
                <p>Hello ${name},</p>
    
                <p>Thank you for contacting us.</p>
    
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
    
                <p><strong>Message:</strong></p>
                <p>${message}</p>
    
                <hr>
    
                <p>
                    Regards,<br>
                    Website Team
                </p>
            </div>
        `,
    
        headers: {
            'X-Mailer': 'NodeMailer'
        }
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, error: error.message });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ success: true, message: 'Email sent successfully!' });
        }
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
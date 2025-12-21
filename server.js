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
        from: process.env.EMAIL_USER,
        to: email, // Sends to the person who filled the form
        replyTo: email, // Ensures if you reply, it goes to the user, not yourself
        subject: `✨ New Message from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                
                <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0;">New Inquiry Received!</h1>
                    <p style="margin: 5px 0 0;">You have a new message from your website</p>
                </div>

                <div style="padding: 20px; background-color: #fafafa;">
                    <p style="font-size: 16px; color: #333;"><strong>Hello!</strong></p>
                    <p style="font-size: 16px; color: #555;">Someone just filled out your contact form. Here are the details:</p>
                    
                    <div style="background-color: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    </div>

                    <p style="font-size: 16px; color: #333;"><strong>Message:</strong></p>
                    <div style="background-color: #fff3cd; padding: 15px; border: 1px solid #ffeeba; border-radius: 5px; color: #856404;">
                        "${message}"
                    </div>
                </div>

                <div style="background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px;">
                    <p style="margin: 0;">Sent automatically by your Node.js App</p>
                </div>

            </div>
        `
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
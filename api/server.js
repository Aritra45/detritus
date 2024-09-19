const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON request body

// Email service setup using Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables for security
        pass: process.env.EMAIL_PASS, // Use environment variables for security
    },
});

// POST route to send OTP email
app.post('/send-email', (req, res) => {
    const { email, otp } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email Address for Detritus',
        html: `<p>Hi there,</p>
               <p>Thank you for signing up with Detritus!</p>
               <p>To complete your registration, please verify your email address by using the following One-Time Password (OTP):</p>
               <p><strong>Your OTP code is: ${otp}</strong></p>
               <p>Please enter this code on the registration page to verify your email. If you did not request this, kindly ignore this message.</p>
               <p>Best regards,<br>The Detritus Team</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).send('OTP sent successfully');
        }
    });
});

// Export the app to be used as a Vercel serverless function
module.exports = app;

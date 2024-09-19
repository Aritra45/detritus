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
        user: 'detritus408@gmail.com', 
        pass: 'pbbs tzir cfso jcsx', 
    },
});

// POST route to send OTP email
app.post('/send-email', (req, res) => {
    const { email, otp } = req.body;
    
    const mailOptions = {
        from: 'detritus408@gmail.com', 
        to: email,
        subject: 'Verify Your Email Address for Detritus',
        html: `<p>Hi there,</p>
               <p>Thank you for signing up with Detritus!</p>
               <p>To complete your registration, please verify your email address by using the following One-Time Password (OTP):</p>
               <p><strong>Your OTP code is: ${otp}</strong></p>
               <p>Please enter this code on the registration page to verify your email. If you did not request this, kindly ignore this message.</p>
               <p>We're excited to have you join our community and help give new life to pre-loved items!</p>
               <p>Best regards,<br>The Detritus Team</p>`
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


// Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, otp } = req.body;

        // Setup email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Use environment variable
                pass: process.env.GMAIL_PASS, // Use environment variable
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER, // Use environment variable
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

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

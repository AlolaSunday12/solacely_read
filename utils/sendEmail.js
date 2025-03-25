const nodemailer = require('nodemailer');
//const keys = require('./keys')
require('dotenv').config();

exports.sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.OTP_EMAIL_USER,
            pass: process.env.OTP_EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false  // 🔥 This allows self-signed certificates
        }
    });

    const mailOptions = {
        from: process.env.OTP_EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};
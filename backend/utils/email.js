const nodemailer = require('nodemailer');

const isEmailConfigured = () => Boolean(
    process.env.SMTP_HOST
    && process.env.SMTP_USER
    && process.env.SMTP_PASSWORD
    && process.env.MAIL_FROM
);

const sendPasswordResetEmail = async (email, otp) => {
    if (!isEmailConfigured()) {
        throw new Error('SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and MAIL_FROM must be configured.');
    }

    const port = Number(process.env.SMTP_PORT || 587);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('SMTP_PORT must be a valid port number.');
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Your Healix password reset code',
        text: `Your Healix password reset code is ${otp}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
        html: `<p>Your Healix password reset code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:8px">${otp}</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>`
    });
};

module.exports = { isEmailConfigured, sendPasswordResetEmail };

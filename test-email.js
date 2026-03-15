require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function testMail() {
    try {
        console.log("Attempting to send with:", process.env.SMTP_USER);
        const info = await transporter.sendMail({
            from: `"Craftory Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'Test Email from Craftory POS',
            text: 'It works!'
        });
        console.log("Success! Message ID:", info.messageId);
    } catch (err) {
        console.error("Nodemailer Error:", err);
    }
}

testMail();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: 'noreply@example.com',
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error;
    }
};

module.exports = sendEmail;

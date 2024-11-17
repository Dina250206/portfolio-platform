const nodemailer = require('nodemailer');

// Конфигурация транспорта для отправки писем
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // SMTP хост
    port: process.env.EMAIL_PORT, // Порт
    auth: {
        user: process.env.EMAIL_USER, // Логин для SMTP
        pass: process.env.EMAIL_PASS, // Пароль для SMTP
    },
});

// Проверка подключения
transporter.verify((error, success) => {
    if (error) {
        console.error("Nodemailer configuration error:", error.message);
    } else {
        console.log("Nodemailer is ready to send emails");
    }
});

// Функция отправки письма
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: '"Portfolio App" <noreply@example.com>', // Отправитель
            to, // Получатель
            subject, // Тема письма
            text, // Текст письма
        };

        // Отправка письма
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error; // Бросаем ошибку для обработки
    }
};

module.exports = sendEmail;

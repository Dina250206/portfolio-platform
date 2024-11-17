const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');

const router = express.Router();

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, age, gender } = req.body;

        // Проверка обязательных полей
        if (!username || !password || !firstName || !lastName || !age || !gender) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Проверка на существующего пользователя
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Создание нового пользователя
        const newUser = new User({ username, password, firstName, lastName, age, gender });
        await newUser.save();

        // Отправка приветственного письма
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: username,
            subject: 'Welcome to the Portfolio Platform!',
            text: `Hello ${firstName}, welcome to our platform!`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Вход пользователя
router.post('/login', async (req, res) => {
    try {
        const { username, password, token } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Проверка существования пользователя
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Проверка пароля
        const isPasswordValid = await user.isValidPassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Проверка 2FA, если включена
        if (user.is2FAEnabled) {
            if (!token) {
                return res.status(400).json({ message: '2FA token is required.' });
            }

            const isTokenValid = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token,
            });

            if (!isTokenValid) {
                return res.status(400).json({ message: 'Invalid 2FA token.' });
            }
        }

        // Аутентификация успешна
        req.session.user = { id: user._id, role: user.role }; // Сохраняем данные сессии
        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Настройка 2FA
router.post('/setup-2fa', async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const secret = user.generateTwoFactorSecret();
        await user.save();

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        res.status(200).json({ qrCodeUrl, secret: secret.base32 });
    } catch (error) {
        console.error('Error during 2FA setup:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;

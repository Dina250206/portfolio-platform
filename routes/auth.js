const express = require('express');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../config/nodemailer'); // Подключение Nodemailer из config

const router = express.Router();

// Функция для генерации JWT токена
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
};

// Рендер страницы регистрации
router.get('/register', (req, res) => {
    res.render('register'); // Убедитесь, что файл views/register.ejs существует
});

// Рендер страницы логина
router.get('/login', (req, res) => {
    res.render('login'); // Убедитесь, что файл views/login.ejs существует
});

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, age, gender } = req.body;

        if (!username || !password || !firstName || !lastName || !age || !gender) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        let role = 'editor';
        const adminEmail = 'kozhayevadina6@gmail.com';
        if (username === adminEmail) {
            role = 'admin';
        }

        const newUser = new User({ username, password, firstName, lastName, age, gender, role });
        await newUser.save();

        const subject = 'Welcome to the Portfolio Platform!';
        const text = `Hello ${firstName}, welcome to our platform! Your role is: ${role}.`;

        await sendEmail(username, subject, text);

        res.status(201).json({ message: 'User registered successfully!', role });
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

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const currentTime = new Date();
        if (user.lastFailedAttempt && currentTime - user.lastFailedAttempt >= 15 * 60 * 1000) {
            user.failedLoginAttempts = 0;
            user.isLocked = false;
            await user.save();
        }

        if (user.isLocked) {
            return res.status(403).json({ message: 'Account is locked due to multiple failed login attempts.' });
        }

        const isPasswordValid = await user.isValidPassword(password);
        if (!isPasswordValid) {
            user.failedLoginAttempts += 1;
            user.lastFailedAttempt = currentTime;

            if (user.failedLoginAttempts >= 3) {
                user.isLocked = true;

                const subject = 'Account Locked';
                const text = 'Your account has been locked due to multiple failed login attempts.';
                await sendEmail(user.username, subject, text);
            }

            await user.save();
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        user.failedLoginAttempts = 0;
        user.lastFailedAttempt = null;
        await user.save();

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

        const jwtToken = generateToken(user);
        res.status(200).json({ message: 'Login successful.', token: jwtToken });
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

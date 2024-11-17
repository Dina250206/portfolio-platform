const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age must be a positive number'],
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female', 'other'],
    },
    role: {
        type: String,
        enum: ['admin', 'editor'],
        default: 'editor',
    },
    is2FAEnabled: {
        type: Boolean,
        default: false,
    },
    twoFactorSecret: {
        type: String,
    },
});

// Хэширование пароля перед сохранением
UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Проверка пароля
UserSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Генерация секрета для 2FA
UserSchema.methods.generateTwoFactorSecret = function () {
    const secret = speakeasy.generateSecret();
    this.twoFactorSecret = secret.base32;
    return {
        otpauth_url: secret.otpauth_url,
        base32: secret.base32,
    };
};

// Проверка 2FA токена
UserSchema.methods.verifyTwoFactorToken = function (token) {
    if (!this.twoFactorSecret) {
        throw new Error('Two-factor authentication is not enabled for this user.');
    }
    return speakeasy.totp.verify({
        secret: this.twoFactorSecret,
        encoding: 'base32',
        token,
    });
};

module.exports = mongoose.model('User', UserSchema);

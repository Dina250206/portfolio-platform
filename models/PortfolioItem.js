const mongoose = require('mongoose');

// Схема для элемента портфолио
const PortfolioItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Заголовок обязательный
    },
    description: {
        type: String,
        required: true, // Описание обязательное
    },
    images: {
        type: [String], // Массив строк для хранения путей к изображениям
        required: true, // Поле обязательно
    },
    createdAt: {
        type: Date,
        default: Date.now, // Дата создания по умолчанию
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Дата обновления по умолчанию
    },
});

// Middleware для обновления поля updatedAt перед сохранением
PortfolioItemSchema.pre('save', function (next) {
    this.updatedAt = Date.now(); // Обновляем updatedAt
    next(); // Переходим к следующему шагу
});

// Экспорт модели PortfolioItem
module.exports = mongoose.model('PortfolioItem', PortfolioItemSchema);

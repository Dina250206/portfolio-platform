require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
 

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);



// Подключение MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

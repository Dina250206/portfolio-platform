const jwt = require('jsonwebtoken');

/**
 * Middleware для проверки и аутентификации JWT токенов.
 */
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization; // Извлекаем заголовок Authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Берем токен после "Bearer"

        // Проверка токена с использованием секретного ключа
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // Токен недействителен или истек
                return res.status(403).json({ message: 'Invalid or expired token.' });
            }

            // Сохраняем данные пользователя в объекте запроса
            req.user = user;
            next(); // Передаем управление следующему middleware
        });
    } else {
        // Заголовок Authorization отсутствует
        res.status(401).json({ message: 'Authorization token is required.' });
    }
};

module.exports = authenticateJWT;

// middleware/authMiddleware.js

// Проверка аутентификации
const authenticate = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Authentication required.' });
    }
};

// Проверка авторизации по ролям
const authorize = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied.' });
        }
    };
};

module.exports = { authenticate, authorize };

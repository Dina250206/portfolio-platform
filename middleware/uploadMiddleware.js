const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Проверяем наличие папки uploads, если нет — создаем
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка хранилища
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Папка, куда будут сохраняться файлы
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileExtension = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${fileExtension}`); // Генерация уникального имени файла
    },
});

// Проверка типа файла (разрешены только изображения)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
};

// Экспорт настроенного Multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Максимальный размер файла 5MB
});

module.exports = upload;

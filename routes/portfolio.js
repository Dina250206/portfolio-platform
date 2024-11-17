const express = require('express');
const PortfolioItem = require('../models/PortfolioItem');
const upload = require('../middleware/uploadMiddleware');
const authenticateJWT = require('../middleware/jwtMiddleware');
const { authorize } = require('../middleware/authMiddleware');
const { getFinancialData } = require('../config/financialApi'); // Импортируем финансовое API
const { getNews } = require('../config/newsApi'); // Импортируем новостное API

const router = express.Router();

// Страница для создания и отображения визуализаций
router.get('/visualization', authenticateJWT, authorize('admin', 'editor'), (req, res) => {
    res.render('visualization'); // Рендерим страницу визуализации
});

// Создание элемента портфолио (доступно администраторам и редакторам)
router.post('/', authenticateJWT, authorize('admin', 'editor'), upload.array('images', 3), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imagePaths = req.files.map((file) => file.path); // Пути к загруженным файлам

        // Проверка: минимум 1 и максимум 3 изображения
        if (!title || !description || imagePaths.length < 1 || imagePaths.length > 3) {
            return res.status(400).json({ message: 'Title, description, and between 1 to 3 images are required.' });
        }

        const newItem = new PortfolioItem({ title, description, images: imagePaths });
        await newItem.save();

        res.status(201).json({ message: 'Portfolio item created successfully.', item: newItem });
    } catch (error) {
        console.error('Error creating portfolio item:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Получение всех элементов портфолио (доступно всем)
router.get('/', async (req, res) => {
    try {
        const items = await PortfolioItem.find();
        res.status(200).json(items); // Отправляем все элементы
    } catch (error) {
        console.error('Error fetching portfolio items:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Получение страницы портфолио с каруселью, финансовыми данными и новостями (доступно всем)
router.get('/view', async (req, res) => {
    try {
        const items = await PortfolioItem.find(); // Получаем все элементы из базы данных

        // Получаем финансовые данные для примера
        const financialData = await getFinancialData('AAPL'); // Пример для компании Apple

        // Получаем новости для примера
        const newsData = await getNews('technology'); // Новости в категории технологии

        res.render('portfolio', {
            items,
            financialData,
            newsData,
        }); // Рендерим EJS-шаблон с данными
    } catch (error) {
        console.error('Error rendering portfolio view:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Получение одного элемента портфолио по ID (доступно всем)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await PortfolioItem.findById(id); // Ищем элемент с переданным id

        if (!item) {
            return res.status(404).json({ message: 'Portfolio item not found.' });
        }

        res.status(200).json(item); // Отправляем найденный элемент
    } catch (error) {
        console.error('Error fetching portfolio item:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Обновление элемента портфолио (доступно только администраторам)
router.put('/:id', authenticateJWT, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, images } = req.body;

        const item = await PortfolioItem.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Portfolio item not found.' });
        }

        // Обновление данных
        item.title = title || item.title;
        item.description = description || item.description;
        item.images = images || item.images;
        await item.save();

        res.status(200).json({ message: 'Portfolio item updated successfully.', item });
    } catch (error) {
        console.error('Error updating portfolio item:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Удаление элемента портфолио (доступно только администраторам)
router.delete('/:id', authenticateJWT, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const item = await PortfolioItem.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ message: 'Portfolio item not found.' });
        }

        res.status(200).json({ message: 'Portfolio item deleted successfully.' });
    } catch (error) {
        console.error('Error deleting portfolio item:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Маршрут для загрузки изображений
router.post('/upload', authenticateJWT, authorize('admin', 'editor'), upload.array('images', 3), async (req, res) => {
    try {
        const imagePaths = req.files.map((file) => file.path); // Пути к загруженным файлам
        res.status(200).json({ message: 'Images uploaded successfully.', images: imagePaths });
    } catch (error) {
        console.error('Error uploading images:', error.message);
        res.status(500).json({ message: 'Failed to upload images.' });
    }
});



module.exports = router;

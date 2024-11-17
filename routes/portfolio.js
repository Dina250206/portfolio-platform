const express = require('express');
const PortfolioItem = require('../models/PortfolioItem');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Создание элемента портфолио (доступно администраторам и редакторам)
router.post('/', authenticate, authorize('admin', 'editor'), async (req, res) => {
    try {
        const { title, description, images } = req.body;

        if (!title || !description || !images || images.length !== 3) {
            return res.status(400).json({ message: 'All fields and exactly 3 images are required.' });
        }

        const newItem = new PortfolioItem({ title, description, images });
        await newItem.save();

        res.status(201).json({ message: 'Portfolio item created successfully.', item: newItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Получение всех элементов портфолио (доступно всем)
router.get('/', async (req, res) => {
    try {
        const items = await PortfolioItem.find();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Получение одного элемента портфолио по ID (доступно всем)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await PortfolioItem.findById(id);

        if (!item) {
            return res.status(404).json({ message: 'Portfolio item not found.' });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Обновление элемента портфолио (доступно администраторам и редакторам)
router.put('/:id', authenticate, authorize('admin', 'editor'), async (req, res) => {
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
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Удаление элемента портфолио (доступно только администраторам)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const item = await PortfolioItem.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ message: 'Portfolio item not found.' });
        }

        res.status(200).json({ message: 'Portfolio item deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;

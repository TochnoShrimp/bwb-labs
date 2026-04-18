import { Router } from 'express';
import { Event } from '../models/index.js';
const router = Router();
router.post('/', async (req, res) => {
    try {
        const { title, description, date } = req.body;
        if (!title || !date) {
            return res.status(400).json({ message: 'Название и дата обязательны' });
        }
        const createdBy = req.user.id;
        const event = await Event.create({ title, description, date, createdBy });
        res.status(201).json(event);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }
        if (event.createdBy !== req.user.id) {
            return res.status(403).json({ message: 'Нет прав на редактирование' });
        }
        await event.update(req.body);
        res.json(event);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }
        if (event.createdBy !== req.user.id) {
            return res.status(403).json({ message: 'Нет прав на удаление' });
        }
        await event.destroy();
        res.status(204).send();
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
export default router;

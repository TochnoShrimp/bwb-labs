import { Router } from 'express';
import { Event, User } from '../models/index.js';
const router = Router();
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        });
        res.json(events);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        });
        if (!event) {
            return res.status(404).json({ message: 'Мероприятие не найдено' });
        }
        res.json(event);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
export default router;

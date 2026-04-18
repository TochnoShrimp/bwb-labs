import { Router } from 'express';
import { Event, User } from '../models/index.js';

const router = Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

// GET /events – публичный список мероприятий
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    res.json(events);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// GET /events/:id – публичное получение мероприятия по ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }
    res.json(event);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

export default router;
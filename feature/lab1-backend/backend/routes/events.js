const { Op } = require('sequelize');
const router = require('express').Router();
const { Event, User } = require('../models'); // предполагается, что у вас есть индексный файл models

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Возвращает список мероприятий
 *     responses:
 *       200:
 *         description: Список мероприятий
 */
// GET /events – список всех мероприятий
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({ include: User });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /events/:id – одно мероприятие
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, { include: User });
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               createdBy:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Мероприятие создано
 */
// POST /events – создание
router.post('/', async (req, res) => {
  try {
    const { title, description, date, createdBy } = req.body;
    if (!title || !date || !createdBy) {
      return res.status(400).json({ message: 'Не хватает обязательных полей' });
    }

    // Проверка лимита
    const dailyLimit = parseInt(process.env.DAILY_EVENT_LIMIT) || 5;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const count = await Event.count({
      where: {
        createdBy,
        createdAt: { [Op.gte]: oneDayAgo },
      },
    });

    if (count >= dailyLimit) {
      return res.status(429).json({ message: `Превышен лимит создания мероприятий (не более ${dailyLimit} в день)` });
    }

    // Создание события
    const event = await Event.create({ title, description, date, createdBy });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /events/:id – обновление
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }
    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /events/:id – удаление
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }
    await event.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const router = require('express').Router();
const { Event, User } = require('../models');

// GET /events – публичный список мероприятий
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /events/:id – публичное получение мероприятия по ID (можно сделать защищённым, если нужно)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
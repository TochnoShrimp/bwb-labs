const router = require('express').Router();
const { User } = require('../models');

// POST /users – создание пользователя
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Имя и email обязательны' });
    }
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    // Обработка уникальности email
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    res.status(500).json({ error: error.message });
  }
});

// GET /users – список пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
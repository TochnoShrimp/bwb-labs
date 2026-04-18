const router = require('express').Router();
const { Event } = require('../models');

router.get('/', async (req, res) => {
  const events = await Event.findAll({ include: 'User' });
  res.json(events);
});

module.exports = router;
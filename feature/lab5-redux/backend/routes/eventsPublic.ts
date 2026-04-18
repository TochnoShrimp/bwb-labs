import { Router } from 'express';
import { Event, User } from '../models/index.js';
import sequelize from '../config/db.js';  // добавьте эту строку

const router = Router();

// GET /events – публичный список мероприятий с количеством участников
router.get('/', async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const events = await Event.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*) FROM "EventParticipants" WHERE "EventParticipants"."eventId" = "Event"."id"
            )`),
            'participantsCount',
          ],
        ],
      },
      paranoid: !includeDeleted,
    });
    res.json(events);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// GET /events/:id – получение одного мероприятия
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*) FROM "EventParticipants" WHERE "EventParticipants"."eventId" = "Event"."id"
            )`),
            'participantsCount',
          ],
        ],
      },
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
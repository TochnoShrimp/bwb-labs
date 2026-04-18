import { Router } from 'express';
import { Event, EventParticipant, User } from '../models/index.js';
import passport from 'passport';
import sequelize from '../config/db.js'; // добавлено на случай, если понадобится

const router = Router();

// POST /events – создание мероприятия
router.post('/', async (req, res) => {
  try {
    const { title, description, date } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: 'Название и дата обязательны' });
    }
    const createdBy = (req.user as any).id;
    const event = await Event.create({ title, description, date, createdBy });
    res.status(201).json(event);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// PUT /events/:id – обновление
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });
    if (event.createdBy !== (req.user as any).id) {
      return res.status(403).json({ message: 'Нет прав на редактирование' });
    }
    await event.update(req.body);
    res.json(event);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// DELETE /events/:id – удаление
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });
    if (event.createdBy !== (req.user as any).id) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }
    await event.destroy();
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// POST /events/:id/participate – регистрация участника
router.post('/:id/participate', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    const existing = await EventParticipant.findOne({
      where: { userId: req.user!.id, eventId: event.id },
    });
    if (existing) return res.status(400).json({ message: 'Вы уже участвуете' });

    await EventParticipant.create({ userId: req.user!.id, eventId: event.id });
    res.status(201).json({ message: 'Вы успешно зарегистрированы' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /events/:id/participate – отмена участия
router.delete('/:id/participate', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    const participant = await EventParticipant.findOne({
      where: { userId: req.user!.id, eventId: event.id },
    });
    if (!participant) return res.status(400).json({ message: 'Вы не участвуете' });

    await participant.destroy();
    res.json({ message: 'Участие отменено' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /events/:id/participants – список участников
router.get('/:id/participants', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    const participants = await event.getParticipants({ attributes: { exclude: ['password'] } });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
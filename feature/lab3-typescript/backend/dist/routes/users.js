import { Router } from 'express';
import { User } from '../models/index.js';
const router = Router();
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        res.json(users);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
        });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        if (parseInt(req.params.id) !== req.user.id) {
            return res.status(403).json({ message: 'Нельзя редактировать чужой профиль' });
        }
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        await user.update(req.body);
        const { password, ...userData } = user.toJSON();
        res.json(userData);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        if (parseInt(req.params.id) !== req.user.id) {
            return res.status(403).json({ message: 'Нельзя удалить чужой профиль' });
        }
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        await user.destroy();
        res.status(204).send();
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
export default router;

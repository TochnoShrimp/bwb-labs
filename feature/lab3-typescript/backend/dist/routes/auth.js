import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, BlacklistedToken } from '../models/index.js';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
const router = Router();
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email уже используется' });
        }
        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'Регистрация успешна', userId: user.id });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email и пароль обязательны' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
router.post('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ message: 'Некорректный токен' });
        }
        const expiresAt = new Date(decoded.exp * 1000);
        await BlacklistedToken.create({ token, expiresAt });
        res.json({ message: 'Выход выполнен успешно' });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
export default router;

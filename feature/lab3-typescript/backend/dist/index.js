import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sequelize from './config/db.js';
import passport from './config/passport.js';
import { checkBlacklist } from './middleware/checkBlacklist.js';
import authRoutes from './routes/auth.js';
import eventsPublicRoutes from './routes/eventsPublic.js';
import eventsPrivateRoutes from './routes/eventsPrivate.js';
import usersRoutes from './routes/users.js';
import { setupSwagger } from './config/swagger.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(checkBlacklist);
setupSwagger(app);
app.use('/auth', authRoutes);
app.use('/events', eventsPublicRoutes);
app.use('/events', passport.authenticate('jwt', { session: false }), eventsPrivateRoutes);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});
const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключение к БД успешно установлено');
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
    }
    catch (error) {
        console.error('Ошибка при запуске:', error);
    }
};
start();

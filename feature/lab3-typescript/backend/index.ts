import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import sequelize from './config/db.js';
import passport from './config/passport.js';
import { checkBlacklist } from './middleware/checkBlacklist.js';

// Импорт маршрутов
import authRoutes from './routes/auth.js';
import eventsPublicRoutes from './routes/eventsPublic.js';
import eventsPrivateRoutes from './routes/eventsPrivate.js';
import usersRoutes from './routes/users.js';

import { setupSwagger } from './config/swagger.js';

// Импорт модели User для декларации
import User from './models/User.js';

// Расширение интерфейса Request
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Passport и проверка чёрного списка
app.use(passport.initialize());
app.use(checkBlacklist);

setupSwagger(app);

// Публичные маршруты
app.use('/auth', authRoutes);
app.use('/events', eventsPublicRoutes);

// Защищённые маршруты (требуется JWT)
app.use('/events', passport.authenticate('jwt', { session: false }), eventsPrivateRoutes);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRoutes);

// Тестовый маршрут
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running' });
});

// Обработка ошибок (централизованная)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Запуск сервера и синхронизация БД
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД успешно установлено');
    await sequelize.sync({ force: true }); // { force: true } только при разработке
    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  } catch (error) {
    console.error('Ошибка при запуске:', error);
  }
};

start();
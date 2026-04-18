require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // подключение к БД

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Подключение маршрутов
app.use('/events', require('./routes/events'));
app.use('/users', require('./routes/users'));

// Запуск сервера и проверка подключения к БД
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД успешно установлено');
    await sequelize.sync(); // синхронизация моделей с БД
    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  } catch (error) {
    console.error('Ошибка при запуске:', error);
  }
};

const morgan = require('morgan');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

start();
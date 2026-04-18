require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/db');
const passport = require('./config/passport');
const checkBlacklist = require('./middleware/checkBlacklist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(passport.initialize());
app.use(checkBlacklist); // после passport, до маршрутов

// Публичные маршруты
app.use('/events', require('./routes/eventsPublic'));
app.use('/auth', require('./routes/auth'));

// Защищённые маршруты
app.use('/events', passport.authenticate('jwt', { session: false }), require('./routes/eventsPrivate'));
app.use('/users', passport.authenticate('jwt', { session: false }), require('./routes/users'));

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД успешно');
    await sequelize.sync(); // создаст таблицы, включая BlacklistedToken
    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  } catch (error) {
    console.error('Ошибка запуска:', error);
  }
};
start();
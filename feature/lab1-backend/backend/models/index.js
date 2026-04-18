// backend/models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Event = require('./Event');

// Если связи ещё не определены в моделях, можно определить их здесь
// User.hasMany(Event, { foreignKey: 'createdBy' });
// Event.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = {
  sequelize,
  User,
  Event
};
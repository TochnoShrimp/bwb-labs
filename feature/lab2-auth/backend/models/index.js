const sequelize = require('../config/db');
const User = require('./User');
const Event = require('./Event');
const BlacklistedToken = require('./BlacklistedToken');

// Связи (если не определены в самих моделях)
User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = {
  sequelize,
  User,
  Event,
  BlacklistedToken,
};
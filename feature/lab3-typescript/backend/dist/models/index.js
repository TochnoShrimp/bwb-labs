import sequelize from '../config/db.js';
import User from './User.js';
import Event from './Event.js';
import BlacklistedToken from './BlacklistedToken.js';
User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });
export { sequelize, User, Event, BlacklistedToken };

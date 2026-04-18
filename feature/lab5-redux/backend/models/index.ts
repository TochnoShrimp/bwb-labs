import sequelize from '../config/db.js';
import User from './User.js';
import Event from './Event.js';
import BlacklistedToken from './BlacklistedToken.js';
import EventParticipant from './EventParticipant.js';

// Связи
User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

User.belongsToMany(Event, { through: EventParticipant, foreignKey: 'userId', otherKey: 'eventId', as: 'participatingEvents' });
Event.belongsToMany(User, { through: EventParticipant, foreignKey: 'eventId', otherKey: 'userId', as: 'participants' });

export { sequelize, User, Event, BlacklistedToken, EventParticipant };
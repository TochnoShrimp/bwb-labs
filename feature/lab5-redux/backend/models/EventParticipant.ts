// models/EventParticipant.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Event from './Event.js';

interface EventParticipantAttributes {
  id: number;
  userId: number;
  eventId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventParticipantCreationAttributes extends Optional<EventParticipantAttributes, 'id'> {}

class EventParticipant extends Model<EventParticipantAttributes, EventParticipantCreationAttributes>
  implements EventParticipantAttributes {
  public id!: number;
  public userId!: number;
  public eventId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventParticipant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Event, key: 'id' },
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default EventParticipant;
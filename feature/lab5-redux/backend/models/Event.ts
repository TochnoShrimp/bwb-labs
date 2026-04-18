import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

export interface EventAttributes {
  id: number;
  title: string;
  description?: string | null;
  date: Date;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'description'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> {
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare date: Date;
  declare createdBy: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
  }
);

export default Event;
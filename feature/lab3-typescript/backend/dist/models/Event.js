import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
class Event extends Model {
    id;
    title;
    description;
    date;
    createdBy;
    createdAt;
    updatedAt;
    deletedAt;
}
Event.init({
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
}, {
    sequelize,
    timestamps: true,
    paranoid: true,
});
User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });
export default Event;

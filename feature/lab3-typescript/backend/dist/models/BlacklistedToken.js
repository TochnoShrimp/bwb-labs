import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
class BlacklistedToken extends Model {
    id;
    token;
    expiresAt;
    createdAt;
    updatedAt;
}
BlacklistedToken.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    timestamps: true,
});
export default BlacklistedToken;

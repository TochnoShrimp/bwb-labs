import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

export interface BlacklistedTokenAttributes {
  id: number;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BlacklistedTokenCreationAttributes extends Optional<BlacklistedTokenAttributes, 'id'> {}

class BlacklistedToken extends Model<BlacklistedTokenAttributes, BlacklistedTokenCreationAttributes> {
  declare id: number;
  declare token: string;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

BlacklistedToken.init(
  {
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
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default BlacklistedToken;
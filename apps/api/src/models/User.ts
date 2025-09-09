import { DataTypes, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import { sequelize } from './index';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: 'student' | 'parent' | 'tutor' | 'admin';
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('student', 'parent', 'tutor', 'admin'), allowNull: false },
  },
  { sequelize, tableName: 'users' }
);



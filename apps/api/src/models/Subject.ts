import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from './db';

export class Subject extends Model<InferAttributes<Subject>, InferCreationAttributes<Subject>> {
  declare id: string;
  declare name: string;
}

Subject.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, tableName: 'subjects' }
);



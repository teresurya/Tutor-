import { DataTypes, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import { sequelize } from './db';

export class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
  declare id: CreationOptional<string>;
  declare studentId: string;
  declare tutorId: string;
  declare subjectId: string;
  declare mode: 'online' | 'in_person';
  declare startAt: Date;
  declare endAt: Date;
  declare status: CreationOptional<'pending' | 'confirmed' | 'cancelled' | 'completed'>;
}

Booking.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    tutorId: { type: DataTypes.UUID, allowNull: false },
    subjectId: { type: DataTypes.UUID, allowNull: false },
    mode: { type: DataTypes.ENUM('online', 'in_person'), allowNull: false },
    startAt: { type: DataTypes.DATE, allowNull: false },
    endAt: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'), defaultValue: 'pending' },
  },
  { sequelize, tableName: 'bookings' }
);



import { DataTypes, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import { sequelize } from './index';

export class TutorProfile extends Model<InferAttributes<TutorProfile>, InferCreationAttributes<TutorProfile>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare bio: string | null;
  declare hourlyRate: number | null;
  declare approvalStatus: 'pending' | 'approved' | 'rejected';
}

TutorProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    bio: { type: DataTypes.TEXT },
    hourlyRate: { type: DataTypes.FLOAT },
    approvalStatus: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
  },
  { sequelize, tableName: 'tutor_profiles' }
);



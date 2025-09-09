import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from './index';

export class TutorSubject extends Model<InferAttributes<TutorSubject>, InferCreationAttributes<TutorSubject>> {
  declare id: string;
  declare tutorProfileId: string;
  declare subjectId: string;
}

TutorSubject.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tutorProfileId: { type: DataTypes.UUID, allowNull: false },
    subjectId: { type: DataTypes.UUID, allowNull: false },
  },
  { sequelize, tableName: 'tutor_subjects' }
);



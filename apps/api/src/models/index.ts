import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { User } from './User';
import { TutorProfile } from './TutorProfile';
import { Subject } from './Subject';
import { TutorSubject } from './TutorSubject';
import { Booking } from './Booking';

// Create a safe Sequelize instance that doesn't require a DATABASE_URL during local dev
export const sequelize = env.databaseUrl
  ? new Sequelize(env.databaseUrl, { dialect: 'postgres', logging: false })
  : new Sequelize('postgres', 'postgres', 'postgres', { dialect: 'postgres', host: 'localhost', logging: false });

export async function initDb() {
  if (!env.databaseUrl) {
    // Skip auth when no real DB configured; models remain usable for typing
    return;
  }
  await sequelize.authenticate();
  // Associations
  TutorProfile.belongsTo(User, { foreignKey: 'userId' });
  User.hasOne(TutorProfile, { foreignKey: 'userId' });

  TutorSubject.belongsTo(TutorProfile, { foreignKey: 'tutorProfileId' });
  TutorSubject.belongsTo(Subject, { foreignKey: 'subjectId' });
  TutorProfile.hasMany(TutorSubject, { foreignKey: 'tutorProfileId' });
  Subject.hasMany(TutorSubject, { foreignKey: 'subjectId' });

  Booking.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
  Booking.belongsTo(User, { as: 'tutor', foreignKey: 'tutorId' });
  Booking.belongsTo(Subject, { foreignKey: 'subjectId' });

  await sequelize.sync();
}



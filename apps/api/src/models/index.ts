import { env } from '../config/env';
import { sequelize } from './db';
import { User } from './User';
import { TutorProfile } from './TutorProfile';
import { Subject } from './Subject';
import { TutorSubject } from './TutorSubject';
import { Booking } from './Booking';

// Create a safe Sequelize instance that doesn't require a DATABASE_URL during local dev
export { sequelize };

export async function initDb() {
  if (!env.databaseUrl) {
    // No Postgres configured; skip real DB setup
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



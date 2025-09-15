import { env } from '../config/env';
import { sequelize } from './db';
import { User } from './User';
import { TutorProfile } from './TutorProfile';
import { Subject } from './Subject';
import { TutorSubject } from './TutorSubject';
import { Booking } from './Booking';

// Models are already initialized in their respective files

// Define associations
User.hasOne(TutorProfile, { foreignKey: 'userId', as: 'tutorProfile' });
TutorProfile.belongsTo(User, { foreignKey: 'userId', as: 'User' });

TutorProfile.hasMany(TutorSubject, { foreignKey: 'tutorProfileId', as: 'tutorSubjects' });
TutorSubject.belongsTo(TutorProfile, { foreignKey: 'tutorProfileId', as: 'tutorProfile' });
TutorSubject.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

User.hasMany(Booking, { foreignKey: 'studentId', as: 'studentBookings' });
Booking.belongsTo(User, { foreignKey: 'studentId', as: 'Student' });

TutorProfile.hasMany(Booking, { foreignKey: 'tutorId', as: 'tutorBookings' });
Booking.belongsTo(TutorProfile, { foreignKey: 'tutorId', as: 'Tutor' });

// Export everything
export { sequelize, User, TutorProfile, Subject, TutorSubject, Booking };

export async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    if (env.databaseUrl) {
      await sequelize.sync({ alter: true }); // Use alter: true for development
      console.log('All models were synchronized successfully.');
    } else {
      console.log('DATABASE_URL not set; using in-memory data for now.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}



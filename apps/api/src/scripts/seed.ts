import bcrypt from 'bcrypt';
import { env } from '../config/env';
import { sequelize } from '../models/db';
import { User } from '../models/User';
import { TutorProfile } from '../models/TutorProfile';
import { Subject } from '../models/Subject';
import { TutorSubject } from '../models/TutorSubject';

async function run() {
  if (!env.databaseUrl) {
    console.error('DATABASE_URL not set; abort seeding');
    process.exit(1);
  }

  await sequelize.authenticate();
  // Ensure tables exist
  await sequelize.sync();

  const [math] = await Subject.findOrCreate({ where: { name: 'Math' }, defaults: { id: 'math-uuid', name: 'Math' } });
  const [english] = await Subject.findOrCreate({ where: { name: 'English' }, defaults: { id: 'english-uuid', name: 'English' } });

  const email = 'tutor@example.com';
  const passwordHash = await bcrypt.hash('secret123', 10);
  const [tutorUser] = await User.findOrCreate({
    where: { email },
    defaults: { name: 'Sample Tutor', email, passwordHash, role: 'tutor' }
  });

  const [profile] = await TutorProfile.findOrCreate({
    where: { userId: tutorUser.id },
    defaults: { userId: tutorUser.id, bio: 'Experienced tutor', hourlyRate: 50, approvalStatus: 'approved' }
  });

  await TutorSubject.findOrCreate({ where: { tutorProfileId: profile.id, subjectId: math.id }, defaults: { id: 'tutor-math-uuid', tutorProfileId: profile.id, subjectId: math.id } });
  await TutorSubject.findOrCreate({ where: { tutorProfileId: profile.id, subjectId: english.id }, defaults: { id: 'tutor-english-uuid', tutorProfileId: profile.id, subjectId: english.id } });

  console.log('Seed complete:', { tutorUserId: tutorUser.id, profileId: profile.id, subjects: [math.name, english.name] });
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });



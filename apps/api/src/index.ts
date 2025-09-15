import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { initDb } from './models';
import authRoutes from './routes/auth';
import tutorRoutes from './routes/tutors';
import bookingRoutes from './routes/bookings';
import meetingRoutes from './routes/meeting';
import adminRoutes from './routes/admin';

async function start() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/auth', authRoutes);
  app.use('/tutors', tutorRoutes);
  app.use('/bookings', bookingRoutes);
  app.use('/meeting', meetingRoutes);
  app.use('/admin', adminRoutes);

  try {
    if (env.databaseUrl) {
      await initDb();
      console.log('Database connected');
    } else {
      console.warn('DATABASE_URL not set; using in-memory data for now');
    }
  } catch (err) {
    console.error('DB connection failed', err);
  }

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

start();



import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
};



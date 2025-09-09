import { Sequelize } from 'sequelize';
import { env } from '../config/env';

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
}



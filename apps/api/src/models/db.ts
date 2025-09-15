import { Sequelize } from 'sequelize';
import { env } from '../config/env';

export const sequelize = env.databaseUrl
  ? new Sequelize(env.databaseUrl, { dialect: 'postgres', logging: false })
  : new Sequelize('postgres', 'postgres', 'postgres', {
      dialect: 'postgres',
      host: 'localhost',
      logging: false,
    });



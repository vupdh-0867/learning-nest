import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const isTestEnv = process.env.NODE_ENV === 'test';

export default {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: isTestEnv ? process.env.DATABASE_TEST : process.env.DATABASE,
  entities: [
    isTestEnv ? 'src/entities/*.entity.ts' : 'dist/entities/*.entity.js',
  ],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  seeds: ['src/database/seeds/*.seed.ts'],
  factories: ['src/database/factories/*.factory.ts'],
} as DataSourceOptions;

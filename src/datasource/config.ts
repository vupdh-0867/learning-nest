import { DataSourceOptions } from 'typeorm';
import { config as configEnv } from 'dotenv';
import config from 'src/config/config';
import DatabaseLogger from 'src/loggers/databaseLogger';

configEnv();
config();

const dbOption = config().database;
const isTestEnv = process.env.NODE_ENV === 'test';

export default {
  type: dbOption.type,
  host: dbOption.host,
  port: dbOption.port,
  username: dbOption.username,
  password: dbOption.password,
  database: isTestEnv ? dbOption.dbTest : dbOption.db,
  entities: [
    isTestEnv ? 'src/entities/*.entity.ts' : 'dist/entities/*.entity.js',
  ],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  seeds: ['src/database/seeds/*.seed.ts'],
  factories: ['src/database/factories/*.factory.ts'],
  logger: new DatabaseLogger(),
} as DataSourceOptions;

import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const isTestEnv = process.env.NODE_ENV !== 'test';

export default {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  entities: [
    isTestEnv ? 'dist/entities/*.entity.js' : 'src/entities/*.entity.ts',
  ],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
} as DataSourceOptions;

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './datasource/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...config,
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}

import { DataSource, ObjectType } from 'typeorm';
import { load } from 'locter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { resolveFilePaths, resolveFilePatterns, useSeederFactory } from 'typeorm-extension';

import AppDataSource from '../src/datasource';
import { AppModule } from '../src/app.module';
import { BadRequestExceptionFilter } from '../src/shared/filters/bad-request-exception.filter';

export const initApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe(),
  );
  app.useGlobalFilters(new BadRequestExceptionFilter());

  await setFactories(['src/database/factories/*.factory.ts']);
  await app.init();

  return app;
};

export const setFactories = async (factoryFiles: string[]): Promise<void> => {
    factoryFiles = await resolveFilePatterns(factoryFiles);
    factoryFiles = resolveFilePaths(factoryFiles);

    for (const factoryFile of factoryFiles) {
      await load(factoryFile);
    }
};

export const initDataSource = async (): Promise<DataSource> => {
  if (!AppDataSource?.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
};

export declare type EntityProperty<Entity> = {
  [Property in keyof Entity]?: Entity[Property];
};

export async function create<T>(
  entity: ObjectType<T>,
  overrideParams?: EntityProperty<T>,
): Promise<T> {
  return useSeederFactory(entity).save(overrideParams);
}

export async function createMany<T>(
  entity: ObjectType<T>,
  amount = 1,
  overrideParams?: EntityProperty<T>,
): Promise<T[]> {
  return useSeederFactory(entity).saveMany(amount, overrideParams);
}

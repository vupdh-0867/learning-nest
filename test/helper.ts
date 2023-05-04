import { DataSource, ObjectType } from 'typeorm';
import { load } from 'locter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resolveFilePaths,
  resolveFilePatterns,
  useSeederFactory,
} from 'typeorm-extension';

import AppDataSource from '../src/datasource';
import { AppModule } from '../src/app.module';
import { User } from '../src/entities/user.entity';
import { hash } from '../src/shared/utils/bcypt.util';
import { BadRequestExceptionFilter } from '../src/shared/filters/bad-request-exception.filter';
import { QueueService } from '../src/queue/queue.service';
import { UserDto } from '../src/user/dtos/user.dto';
import { Post } from '../src/entities/post.entity';
import { FileService } from '../src/multer/file.service';

export const initApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe());
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

export async function createUser(
  email: string,
  password: string,
): Promise<User> {
  return await create<User>(User, {
    email: email,
    password: await hash(password),
  });
}

export async function mockSendMail(queueService: QueueService) {
  jest
    .spyOn(queueService, 'sendMailCreatePost')
    .mockImplementation((_user: UserDto, _post: Post) => {
      return;
    });
}

export async function mockFileService(fileService: FileService) {
  jest
    .spyOn(fileService, 'uploadFile')
    .mockImplementation((file: Express.Multer.File) => {
      const randomToken = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return Promise.resolve(`${randomToken}-${file.originalname}`);
    });

  jest
    .spyOn(fileService, 'generatePresignedUrl')
    .mockImplementation((key: string) => {
      let url: string;
      if (key) url = `https://example.com/${key}`;
      else url = '';

      return Promise.resolve(url);
    });
}

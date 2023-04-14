import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { InternalServerErrorExceptionFilter } from './shared/filters/internal-server-error-exception.filter';
import { BadRequestExceptionFilter } from './shared/filters/bad-request-exception.filter';
import { EntityNotFoundExceptionFilter } from './shared/filters/entity-not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new InternalServerErrorExceptionFilter(),
    new BadRequestExceptionFilter(),
    new EntityNotFoundExceptionFilter(),
  );

  await app.listen(3000);
}
bootstrap();

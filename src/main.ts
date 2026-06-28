import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Sin ETag: cada GET responde 200 con cuerpo, nunca 304 Not Modified.
  app.getHttpAdapter().getInstance().set('etag', false);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({ origin: '*' });
  const port = process.env.PORT ?? 3003;
  await app.listen(port, '0.0.0.0');
  console.log(`api-turnos corriendo en puerto ${port}`);
}

bootstrap();

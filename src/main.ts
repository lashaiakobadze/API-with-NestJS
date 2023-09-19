
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // The most straightforward way to handle PATCH is to pass  skipMissingProperties to our  ValidationPipe.
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));

  await app.listen(3000);
}
bootstrap();
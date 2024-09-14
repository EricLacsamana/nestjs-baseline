import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { SeedService } from './seed/seed.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const seedService = app.get(SeedService);
  // try {
  //   await seedService.seed();
  // } catch (error) {
  //   console.error('Error seeding data:', error);
  // } finally {
  //   await app.close();
  // }

  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  app.enableCors({
    origin: process.env.WEB_URL,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const options = new DocumentBuilder()
    .setTitle('NestJs Baseline')
    .setDescription('API documentation for the NestJs Baseline')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();

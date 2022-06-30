import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppDataSource } from './config/typeorm.config';

async function bootstrap() {
  const logger = new Logger('boostrap');
  const app = await NestFactory.create(AppModule);

  AppDataSource.initialize().catch((err) => console.error(err));

  const config = new DocumentBuilder()
    .setTitle('Confectionary API')
    .setDescription('Discover the API for Confectionary client')
    .setVersion('1.1')
    .addTag('chocolates')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
  logger.log(
    `Application envs: DBPORT: ${process.env.DB_PORT},\nDB HOST: ${process.env.DB_HOST},\nDB USERNAME: ${process.env.DB_USER},\nDB PASS: ${process.env.DB_PASS},\nDBSYNC: ${process.env.DB_SYNC}`
  );
}
bootstrap();

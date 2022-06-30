import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('boostrap');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chocolatiste API')
    .setDescription('Discover the API for Chocolatiste client')
    .setVersion('1.0')
    .addTag('chocolate')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
  logger.log(
    `Application envs: DBPORT: ${process.env.DB_PORT}, DBHOST: ${process.env.DB_HOST}, DB USERNAME: ${process.env.DB_USERNAME} DB PASS: ${process.env.DB_PASSWORD}, DBSYNC: ${process.env.DB_SYNC}`
  );
}
bootstrap();

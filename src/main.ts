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
    .setVersion('1.2')
    .addTag('chocolates')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
  logger.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);
  logger.log(`DBPORT: ${process.env.DB_PORT}`);
  logger.log(`DB HOST: ${process.env.DB_HOST}`);
  logger.log(`DB USERNAME: ${process.env.DB_USER}`);
  logger.log(`DB PASS: ${process.env.DB_PASS}`);
  logger.log(`DBSYNC: ${process.env.DB_SYNC}`);
}
bootstrap();

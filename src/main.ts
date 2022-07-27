import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppDataSource } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('boostrap');
  await ConfigModule.envVariablesLoaded.then(() => {
    logger.log('Configuration files loaded');
  });
  AppDataSource.initialize().catch((err) => console.error(err));
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Confectionary API')
    .setDescription('Discover the API for Confectionary client')
    .setVersion('1.2')
    .addTag('chocolates')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();

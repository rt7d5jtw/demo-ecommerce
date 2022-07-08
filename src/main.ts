import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppDataSource } from './config/typeorm.config';

async function bootstrap() {
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
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppDataSource } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';

// For HTTPS
// import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('boostrap');

  await ConfigModule.envVariablesLoaded
    .then(() => {
      logger.log('Configuration files loaded');
    })
    .catch((err) => err);

  //const httpsOptions = {
  //  key: fs.readFileSync(`${process.env.PRIVKEY}`),
  //  cert: fs.readFileSync(`${process.env.CERT}`)
  //};

  AppDataSource.initialize().catch((err) => console.error(err));
  const app = await NestFactory.create(AppModule, {
    //httpsOptions
  });

  const config = new DocumentBuilder()
    .setTitle('Confectionary API')
    .setDescription('Discover the API for Confectionary client')
    .setVersion('1.2')
    .addTag('chocolates')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // More at: https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    // Configures the `Access-Control-Allow-Origins` CORS header
    origin: '*', // 'http://localhost:3000',
    // Configures the Access-Control-Allow-Methods CORS header.
    methods: 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    // Configures the Access-Control-Allow-Headers CORS header.
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    // Configures the Access-Control-Max-Age CORS header.
    maxAge: 86400,
    // Whether to pass the CORS preflight response to the next handler.
    preflightContinue: false,
    // Provides a status code to use for successful OPTIONS requests.
    optionsSuccessStatus: 204
  });

  await app.listen(process.env.PORT, process.env.HOST);
}
bootstrap();

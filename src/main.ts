import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('boostrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  /* client static assets */
  //if (process.env.NODE_ENV === 'production') {
  //app.use(express.static)
  //}

  const port = process.env.PORT;
  await app.listen(port);

  logger.log(
    `hers vars ${process.env.JWT_SECRET}, ${process.env.STRIPE_SECRET}, ${process.env.DB_HOST}, ${process.env.DB_USERNAME}, ${process.env.DB_PASSWORD}, ${process.env.DB_DATABASE}`
  );
  logger.log(`Application listening on port ${port}`);
}
bootstrap();

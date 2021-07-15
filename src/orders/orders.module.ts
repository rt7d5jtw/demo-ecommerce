import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersRepository } from './orders.repository';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
//import { StripeModule } from '@golevelup/nestjs-stripe';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersRepository]),
    /*StripeModule.forRoot(StripeModule, {
      apiKey: process.env.STRIPE_SECRET,
    }),*/
    PassportModule,
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

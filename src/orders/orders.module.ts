import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Order } from './order.entity';
//import { StripeModule } from '@golevelup/nestjs-stripe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
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

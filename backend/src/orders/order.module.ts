import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderService } from './order.service';
import { OrderDIKeys } from './key';

@Module({
  providers: [
    {
      provide: OrderDIKeys.OrderService,
      useClass: OrderService,
    },
  ],
  controllers: [OrdersController],
  exports: [OrderDIKeys.OrderService],
})
export class OrderModule {}

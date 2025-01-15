import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderService } from './order.service';
import { OrderDIKeys } from './key';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
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

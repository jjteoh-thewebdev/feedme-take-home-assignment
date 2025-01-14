import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { IOrderService } from './order.service';
import { OrderDIKeys } from './key';

@Controller({
  path: 'orders',
})
export class OrdersController {
  constructor(
    @Inject(OrderDIKeys.OrderService)
    private _orderService: IOrderService,
  ) {}

  @Get()
  async getOrders() {
    // TODO: pagination
    return await this._orderService.getOrders();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body(`isVip`) isVip: boolean) {
    // TODO: parse isVIP
    return await this._orderService.createOrder(isVip);
  }
}

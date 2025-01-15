import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderStatus } from './order.model';
import { WebsocketGateway } from '../websocket/websocket.gateway';

// async/await is used here because in real world this would be some io process, i.g. read/write db
export interface IOrderService {
  createOrder(isVip: boolean): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getNextPendingOrder(): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<Order>;
}

@Injectable()
export class OrderService implements IOrderService {
  // we will use in-memory storage for this prototype
  private _orders: Order[] = [];
  private _nextOrderId = 1;

  constructor(private _wsGateway: WebsocketGateway) {}

  async createOrder(isVip = false): Promise<Order> {
    // for prototyping purpose, we limit orders only at 100
    if (this._nextOrderId > 100) {
      throw new BadRequestException(`Sorry, max orders reached`);
    }

    const newOrder: Order = {
      id: this._nextOrderId++,
      isVip,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
    };

    if (newOrder.isVip) {
      const index = this._orders.findIndex(
        (order) => order.status === OrderStatus.PENDING && !order.isVip,
      );

      if (index === -1) {
        // If no non-VIP orders exist, push to the end of the queue.
        this._orders.push(newOrder);
      } else {
        // Insert the new VIP order before the first non-VIP order.
        this._orders.splice(index, 0, newOrder);
      }
    } else {
      // If normal order, add to the end of queue
      this._orders.push(newOrder);
    }

    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    // TODO: pagination
    return this._orders;
  }

  async getNextPendingOrder(): Promise<Order | undefined> {
    return this._orders.find((o) => o.status === OrderStatus.PENDING);
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = this._orders.find((o) => o.id === id);

    if (!order) {
      throw new NotFoundException();
    }

    order.status = status;

    this._wsGateway.emitOrderUpdate(order);
    return order;
  }
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Bot, BotStatus } from './bot.model';
import { IOrderService } from '../orders/order.service';
import { OrderStatus } from '../orders/order.model';
import { OrderDIKeys } from '../orders/key';
import { WebsocketGateway } from '../websocket/websocket.gateway';

// async/await is used here because in real world this would be some io process, i.g. read/write db
export interface IBotService {
  getAllBots(): Promise<Bot[]>;
  addBot(): Promise<Bot>;
  removeBot(): Promise<void>;
}

@Injectable()
export class BotService implements IBotService {
  private _bots: Bot[] = [];
  private _nextBotId = 1;

  // robot:job - tracker
  private _jobTracker: Map<number, NodeJS.Timeout> = new Map();

  constructor(
    @Inject(OrderDIKeys.OrderService)
    private _orderService: IOrderService,
    private _wsGateway: WebsocketGateway,
  ) {}

  async getAllBots(): Promise<Bot[]> {
    return this._bots;
  }

  async addBot(): Promise<Bot> {
    // for this prototyping, we limit bot count to 30
    if (this._bots.length > 30) {
      throw new BadRequestException(`Sorry, max bot reached`);
    }

    const newBot: Bot = {
      id: this._nextBotId++,
      status: BotStatus.IDLE,
      createdAt: new Date(),
    };

    this._bots.push(newBot);
    this._wsGateway.emitBotUpdate(this._bots);

    this.startProcessing(newBot.id);

    return newBot;
  }

  async removeBot(): Promise<void> {
    if (this._bots.length === 0) return;

    // release job of last bot
    const lastBot = this._bots.pop();
    const timer = this._jobTracker.get(lastBot.id);
    if (timer) clearTimeout(timer);

    this._wsGateway.emitBotUpdate(this._bots);
  }

  // job assignments logic, optionally can move this to a standalone service
  private async startProcessing(botId: number): Promise<void> {
    const processNextOrder = async () => {
      const order = await this._orderService.getNextPendingOrder();

      if (order) {
        await this._orderService.updateOrderStatus(
          order.id,
          OrderStatus.PROCESSING,
        );

        // update status to COMPLETED after 10 seconds
        const timer = setTimeout(async () => {
          await this._orderService.updateOrderStatus(
            order.id,
            OrderStatus.COMPLETED,
          );
          processNextOrder();
        }, 10000);

        this._jobTracker.set(botId, timer);
      } else {
        // TODO: can change to event trigger, when order created
        // No orders to process, check again in 1 second
        const timer = setTimeout(processNextOrder, 1000);
        this._jobTracker.set(botId, timer);
      }
    };

    processNextOrder();
  }
}

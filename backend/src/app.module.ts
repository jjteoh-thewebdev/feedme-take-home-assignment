import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './orders/order.module';
import { BotModule } from './bots/bot.module';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [OrderModule, BotModule],
  controllers: [AppController],
  // TODO: may need move websocket to upper module
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}

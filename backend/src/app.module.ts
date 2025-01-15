import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './orders/order.module';
import { BotModule } from './bots/bot.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [OrderModule, BotModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

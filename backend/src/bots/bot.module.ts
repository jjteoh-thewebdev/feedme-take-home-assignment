import { Module } from '@nestjs/common';
import { OrderModule } from '../orders/order.module';
import { BotsController } from './bots.controller';
import { BotService } from './bot.service';
import { BotDIKeys } from './key';

@Module({
  imports: [OrderModule],
  providers: [
    {
      provide: BotDIKeys.BotService,
      useClass: BotService,
    },
  ],
  controllers: [BotsController],
  exports: [BotDIKeys.BotService],
})
export class BotModule {}

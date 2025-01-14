import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { BotService, IBotService } from './bot.service';
import { BotDIKeys } from './key';

@Controller({
  path: `bots`,
})
export class BotsController {
  constructor(@Inject(BotDIKeys.BotService) private _botService: IBotService) {}

  @Get()
  async getAllBots() {
    return await this._botService.getAllBots();
  }

  @Post(`/spawn`)
  @HttpCode(HttpStatus.OK)
  async spwanBot() {
    return await this._botService.addBot();
  }

  @Post(`/deduct`)
  @HttpCode(HttpStatus.OK)
  async deductBot() {
    return await this._botService.removeBot();
  }
}

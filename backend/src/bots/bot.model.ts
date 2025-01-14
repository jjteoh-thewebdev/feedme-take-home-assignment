export enum BotStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
}

export interface Bot {
  id: number;
  status: BotStatus;
  createdAt: Date;
}

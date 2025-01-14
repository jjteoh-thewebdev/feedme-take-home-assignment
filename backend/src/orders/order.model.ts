export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

export interface Order {
  id: number;
  isVip: boolean;
  status: OrderStatus;
  createdAt: Date;
}

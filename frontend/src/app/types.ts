export interface Order {
  id: number;
  isVip: boolean;
  status: "PENDING" | "PROCESSING" | "COMPLETED";
  createdAt: Date;
}

export interface Bot {
  id: number;
  status: "IDLE" | "PROCESSING";
}

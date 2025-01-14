import { Order } from "../types";

interface OrderAreaProps {
  title: string;
  orders: Order[];
}

export default function OrderArea({ title, orders }: OrderAreaProps) {
  return (
    <div className="flex-1 border p-4 rounded">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`p-2 rounded ${
              order.isVip ? "bg-yellow-200" : "bg-blue-200"
            }`}
          >
            Order #{order.id} - {order.isVip ? "VIP" : "Normal"}
          </div>
        ))}
      </div>
    </div>
  );
}

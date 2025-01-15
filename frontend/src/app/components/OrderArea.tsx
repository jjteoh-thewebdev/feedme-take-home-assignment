import { Order } from "../types";

interface OrderAreaProps {
  title: string;
  orders: Order[];
}

export default function OrderArea({ title, orders }: OrderAreaProps) {
  return (
    <div className="flex-1 border p-4 rounded">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="space-y-2 max-h-[70vh] overflow-y-auto">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`p-2 rounded ${
              order.isVip ? "bg-yellow-200" : "bg-blue-200"
            }`}
          >
            <h2 className="text-xl font-bold mb-2">
              #{order.id}
              {order.isVip ? (
                <span className="inline-flex items-center ml-2">VIP</span>
              ) : (
                ""
              )}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

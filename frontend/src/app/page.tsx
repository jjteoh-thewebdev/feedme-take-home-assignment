"use client";

import { useState, useEffect } from "react";
import OrderArea from "./components/OrderArea";
import ControlPanel from "./components/ControlPanel";
import { Bot, Order } from "./types";
import { socket } from "./socket";

export default function Home() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);

  useEffect(() => {
    socket.on("orderUpdated", (updatedOrder: Order) => {
      if (updatedOrder.status === "PENDING") {
        setPendingOrders((prev) => [
          ...prev.filter((o) => o.id !== updatedOrder.id),
          updatedOrder,
        ]);
      } else if (updatedOrder.status === "COMPLETED") {
        setPendingOrders((prev) =>
          prev.filter((o) => o.id !== updatedOrder.id)
        );
        setCompletedOrders((prev) => [...prev, updatedOrder]);
      }
    });

    socket.on("botUpdated", (updatedBots: Bot[]) => {
      setBots(updatedBots);
    });

    return () => {
      socket.off("orderUpdated");
      socket.off("botUpdated");
    };
  }, []);

  const createOrder = async (isVip: boolean) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVip }),
    });
    const newOrder = await response.json();
    setPendingOrders((prev) => [...prev, newOrder]);
  };

  const addBot = async () => {
    const response = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const updatedBots = await response.json();
    setBots(updatedBots);
  };

  const removeBot = async () => {
    const response = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const updatedBots = await response.json();
    setBots(updatedBots);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">McDonald&apos;s Order System</h1>
      <ControlPanel
        botCount={bots.length}
        createOrder={createOrder}
        addBot={addBot}
        removeBot={removeBot}
      />
      <div className="flex justify-between gap-4 mt-4">
        <div className="flex flex-col flex-1">
          <OrderArea title="PENDING" orders={pendingOrders} />
          <div className="mt-4 px-4">
            <h2 className="text-xl font-bold mb-2">0001</h2>
            {/* <div className="flex gap-2">
              {bots.map((bot) => (
            <div
              key={bot.id}
              className={`p-2 rounded ${
                bot.status === "IDLE" ? "bg-gray-200" : "bg-green-200"
              }`}
            >
              Bot {bot.id}: {bot.status}
            </div>
          ))}
            </div> */}
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <OrderArea title="COMPLETED" orders={completedOrders} />
          <div className="mt-4 px-4">
            <h2 className="text-xl font-bold mb-2">0001</h2>
            {/* <div className="flex gap-2">
              {bots.map((bot) => (
            <div
              key={bot.id}
              className={`p-2 rounded ${
                bot.status === "IDLE" ? "bg-gray-200" : "bg-green-200"
              }`}
            >
              Bot {bot.id}: {bot.status}
            </div>
          ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

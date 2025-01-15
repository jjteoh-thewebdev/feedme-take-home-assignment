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
    getAllBots();
    getAllOrders();

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
        setCompletedOrders((prev) => [updatedOrder, ...prev]);
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

  const getAllBots = async () => {
    const response = await fetch("http://localhost:3002/bots", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const fetchedBots = await response.json();
    setBots(fetchedBots);
  };

  const getAllOrders = async () => {
    const response = await fetch("http://localhost:3002/orders", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const fetchedOrders: Order[] = (await response.json()) ?? [];

    setPendingOrders(
      fetchedOrders.filter((order) =>
        ["PENDING", "PROCESSING"].includes(order.status)
      )
    );
    setCompletedOrders(
      fetchedOrders.filter((order) => order.status === "COMPLETED")
      // .sort(
      //   (order1, order2) =>
      //     new Date(order2.createdAt).getTime() -
      //     new Date(order1.createdAt).getTime()
      // )
    );
  };

  const createOrder = async (isVip: boolean) => {
    const response = await fetch("http://localhost:3002/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVip }),
    });
    const newOrder = await response.json();
    setPendingOrders((prev) => [...prev, newOrder]);
  };

  const addBot = async () => {
    const response = await fetch("http://localhost:3002/bots/spawn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const updatedBots = await response.json();
    setBots([...bots, updatedBots]);
  };

  const removeBot = async () => {
    await fetch("http://localhost:3002/bots/deduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    getAllBots();
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
        </div>

        <div className="flex flex-col flex-1">
          <OrderArea title="COMPLETED" orders={completedOrders} />
        </div>
      </div>
    </div>
  );
}

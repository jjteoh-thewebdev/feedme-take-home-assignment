import { Button } from "../components/ui/button";

interface ControlPanelProps {
  botCount: number;
  createOrder: (isVip: boolean) => void;
  addBot: () => void;
  removeBot: () => void;
}

export default function ControlPanel({
  botCount,
  createOrder,
  addBot,
  removeBot,
}: ControlPanelProps) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button onClick={() => createOrder(false)}>+ Normal Order</Button>
        <Button onClick={() => createOrder(true)}>+ VIP Order</Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => addBot()}>+</Button>
        Bots: {botCount}
        <Button onClick={() => removeBot()}>-</Button>
      </div>
    </div>
  );
}

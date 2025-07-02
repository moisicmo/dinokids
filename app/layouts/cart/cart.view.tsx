import { useEffect, useState } from "react";
import { useCartStore } from "@/hooks";
import type { FormPaymentModel } from "@/models";
import { CartDetail, CartItem } from '.';

interface Props {
  onClose: () => void;
}

export const CartView = ({ onClose }: Props) => {


  const { cart, removeItemCart } = useCartStore();

  const [total, setTotal] = useState(0);
  const [itemCart, setItemCart] = useState<FormPaymentModel | null>(null);

  useEffect(() => {
    if (cart.length == 0) return;
    const total = cart.reduce((acc, item) => acc + item.amount, 0);
    setTotal(total);
  }, [cart]);

  return (
    <>
      <div className="flex flex-col h-full px-1">
        <h2 className="text-lg font-semibold mb-2">Cobro</h2>

        <div className="flex-1 overflow-y-auto px-2">
          {cart.map((item) => (
            <CartItem
              key={`${item.debt.id}`}
              item={item}
              updateItem={() => setItemCart(item)}
              removeItem={() => removeItemCart(item)}
            />
          ))}
        </div>

        <div className="flex justify-between items-center py-2 text-base font-medium">
          <span>Total a pagar:</span>
          <span>{total} Bs.</span>
        </div>

        {cart.length !== 0 && <CartDetail />}
      </div>
    </>
  );

};
import { useCallback, useEffect, useState } from "react";
// import { CardItem, DetailCart } from ".";
import { useCartStore } from "@/hooks";
import type { CartModel } from "@/models";
// import { PaymentModal } from "../pages/payments/inscription/PaymentModal";

interface Props {
  onClose: () => void;
}

const CartView = ({ onClose }: Props) => {


  const { cart = [], removeItem } = useCartStore();

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState<CartModel | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialog = useCallback((value: boolean) => {
    setOpenDialog(value);
  }, []);

  // useEffect(() => {
  //   const handleResize = () => setScreenHeight(window.innerHeight);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // useEffect(() => {
  //   const total = cart.reduce((acc, item) => acc + item.paymentModel.amount, 0);
  //   setTotal(total);
  //   if (cart.length === 0) {
  //     onClose();
  //   }
  // }, [cart, onClose]);

  return (
    <>
      <div className="flex flex-col px-4">
        <h2 className="text-lg font-semibold mb-2">Cobro</h2>
        <div
          className="overflow-y-auto mb-2"
        >
          {/* {cart.map((item) => (
            <CardItem
              key={`${item.DebtModel.id}`}
              item={item}
              updateItem={() => {
                setItem(item);
                handleDialog(true);
              }}
              removeItem={() => removeItem(item)}
            />
          ))} */}
        </div>

        <div className="flex justify-between items-center py-2 text-base font-medium">
          <span>Total a pagar:</span>
          <span>{total} Bs.</span>
        </div>

        {/* {cart.length !== 0 && <DetailCart />} */}
      </div>

      {/* {item && cart.length !== 0 && (
        <PaymentModal
          open={openDialog}
          handleClose={() => handleDialog(false)}
          Debt={item.DebtModel}
          formPaymentModel={{
            amount: item.paymentModel.amount,
            dueDate: item.paymentModel.dueDate,
          }}
          student={cart[0].student}
        />
      )} */}
    </>
  );
};

export default CartView;

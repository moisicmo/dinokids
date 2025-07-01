import { useEffect, useState, type FormEvent } from "react";
import { useCartStore, useForm } from "@/hooks";
import { formPaymentValidations, type FormPaymentModel } from "@/models";
import { ButtonCustom, InputCustom } from "@/components";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  handleClose: () => void;
  item: FormPaymentModel;
}

export const PaymentCreate = ({ open, handleClose, item }: Props) => {
  const {
    debt,
    amount,
    dueDate,
    onInputChange,
    onResetForm,
    isFormValid,
    amountValid,
    dueDateValid,
  } = useForm(item, formPaymentValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const { addCard } = useCartStore();

  const sendSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    addCard({
      debt,
      amount: parseFloat(amount),
      dueDate,
    });
    handleClose();
    onResetForm();
  };

  useEffect(() => {
    if (item) {
      setFormSubmitted(false);
    }
  }, [item]);

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-transform ${open ? "" : "pointer-events-none"
        }`}
    >
      {/* Fondo oscuro */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"
          }`}
        onClick={() => {
          onResetForm();
          handleClose();
        }}
      />

      {/* Drawer lateral */}
      <div
        className={`relative ml-auto w-full max-w-md bg-white h-full shadow-lg transform transition-transform ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Nuevo Pago</h2>
          <button
            onClick={() => {
              onResetForm();
              handleClose();
            }}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={sendSubmit} className="p-4 flex flex-col gap-4">
          <InputCustom
            name="amount"
            value={amount}
            label="Monto"
            onChange={onInputChange}
            error={!!amountValid && formSubmitted}
            helperText={formSubmitted ? amountValid : ""}
          />
          <InputCustom
            name="dueDate"
            value={dueDate}
            label="Fecha de compromiso"
            onChange={onInputChange}
            error={!!dueDateValid && formSubmitted}
            helperText={formSubmitted ? dueDateValid : ""}
          />

          <div className="flex justify-end gap-2 pt-4">
            <ButtonCustom
              onClick={() => {
                onResetForm();
                handleClose();
              }}
              text="Cancelar"
              color="bg-gray-400"
            />
            <ButtonCustom type="submit" text="Agregar al carrito" />
          </div>
        </form>
      </div>
    </div>
  );
};

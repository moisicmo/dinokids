
import { Pencil, Trash2 } from "lucide-react";
// import { CartModel } from "@/models";
import { format } from "date-fns";
import type { CartModel } from "@/models";
// import esES from "date-fns/locale/es";

interface Props {
  item: CartModel;
  updateItem: () => void;
  removeItem: () => void;
}

export const CartItem = ({ item, updateItem, removeItem }: Props) => {
  return (
    <div className="flex flex-col pb-2">
      <div className="flex justify-between items-start gap-2">

        {/* Información principal */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <span className="text-gray-800 font-medium">{item.DebtModel.type}</span>
            <span className="text-gray-900 font-semibold">{item.paymentModel.amount} Bs.</span>
          </div>

          {item.paymentModel.dueDate && (
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Venc:</span>
              {/* <span>{format(new Date(item.paymentModel.dueDate), "dd-MM-yyyy", { locale: esES })}</span> */}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={updateItem}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-600 hover:text-blue-500 transition"
            aria-label="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={removeItem}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-500 transition"
            aria-label="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Línea divisora */}
      <div className="h-px bg-gray-300 mt-2" />
    </div>
  );
};

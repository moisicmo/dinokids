import { ChevronDown, ChevronUp, Download, Pencil, ShoppingCart, Trash2 } from 'lucide-react';

interface ActionButtonsProps<T extends { id?: string; userId?: string }> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  onPayment?: (id: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}


export const ActionButtons = <T extends { id?: string; userId?: string }>({
  item,
  onEdit,
  onDelete,
  onDownload,
  onPayment,
  onSelect,
  isSelected,
}: ActionButtonsProps<T>) => {
  const identifier = item.userId ?? item.id ?? '';


  return (
    <div className="flex justify-center items-center gap-3">
      {onSelect && identifier && (
        <button
          onClick={() => onSelect(identifier)}
          title="Desplegar"
          className="cursor-pointer"
        >
          {isSelected ? (
            <ChevronUp color="var(--color-black)" className="w-5 h-5" />
          ) : (
            <ChevronDown color="var(--color-black)" className="w-5 h-5" />
          )}

        </button>
      )}

      {onPayment && identifier && (
        <button
          onClick={(e) => onPayment?.(identifier, e)}
          className="flex items-center gap-1 text-secondary hover:opacity-80 cursor-pointer"
          title="Agregar al carrito de pagos"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-sm hidden md:inline">Agregar</span>
        </button>
      )}

      {onDownload && identifier && (
        <button onClick={() => onDownload(identifier)} title="Descargar" className="cursor-pointer">
          <Download color="var(--color-info)" className="w-5 h-5" />
        </button>
      )}
      {onEdit && (
        <button onClick={() => onEdit(item)} title="Editar" className="cursor-pointer">
          <Pencil color="var(--color-info)" className="w-5 h-5" />
        </button>
      )}
      {onDelete && identifier && (
        <button onClick={() => onDelete(identifier)} title="Eliminar" className="cursor-pointer">
          <Trash2 color="var(--color-error)" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

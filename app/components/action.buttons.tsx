import { CircleDollarSign, Download, Pencil, Trash2 } from 'lucide-react';

interface ActionButtonsProps<T extends { id?: string; userId?: string }> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  onPayment?: (id: string) => void;
}

export const ActionButtons = <T extends { id?: string; userId?: string }>({
  item,
  onEdit,
  onDelete,
  onDownload,
  onPayment,
}: ActionButtonsProps<T>) => {
  const identifier = item.userId ?? item.id ?? '';

  return (
    <div className="flex justify-center items-center gap-3">
      {onPayment && identifier && (
        <button onClick={() => onPayment(identifier)} title="Pagar" className="cursor-pointer">
          <CircleDollarSign color="var(--color-secondary)" className="w-5 h-5" />
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

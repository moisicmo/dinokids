import { Pencil, Trash2 } from 'lucide-react';

interface ActionButtonsProps<T extends { id?: string; userId?: string }> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
}

export const ActionButtons = <T extends { id?: string; userId?: string }>({
  item,
  onEdit,
  onDelete,
}: ActionButtonsProps<T>) => {
  const identifier = item.userId ?? item.id ?? '';

  return (
    <div className="flex justify-center items-center gap-3">
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

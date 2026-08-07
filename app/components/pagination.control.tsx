import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  total: number;
  page: number;
  limit: number;
  onPageChange: (value: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export const PaginationControls = (props: Props) => {
  const {
    total,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
  } = props;
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex justify-end items-center text-sm px-4 py-3">
      <div className="flex items-center space-x-6">
        {/* Dropdown de cantidad */}
        <div className="flex items-center space-x-2">
          <span className="text-foreground">Filas por página:</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => onRowsPerPageChange(Number(val))}
          >
            <SelectTrigger className="w-auto border-none bg-transparent shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rango */}
        <span className="text-foreground">
          {from}–{to} de {total}
        </span>

        {/* Botones de navegación */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="text-foreground disabled:text-muted-foreground hover:text-primary disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="text-foreground disabled:text-muted-foreground hover:text-primary disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

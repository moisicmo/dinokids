import { useEffect, useState } from 'react';
import { ActionButtons, SelectCustom, type ValueSelect } from '@/components';
import { PaginationControls } from '@/components/pagination.control';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermissionStore } from '@/hooks';
import { CashMovementType, TypeAction, TypeSubject, type BaseResponse, type CashMovementModel } from '@/models';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  dataCashMovement: BaseResponse<CashMovementModel>;
  onRefresh: (type?: CashMovementType, page?: number, limit?: number) => void;
  onDelete: (id: string, type: CashMovementType) => void;
  limitInit?: number;
}

const typeFilterOptions: ValueSelect[] = [
  { id: '', value: 'Todos' },
  ...Object.entries(CashMovementType).map(([key, value]) => ({ id: key, value })),
];

export const CashMovementTable = ({ dataCashMovement, onRefresh, onDelete, limitInit = 10 }: Props) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [type, setType] = useState('');
  const { hasPermission } = usePermissionStore();

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataCashMovement.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataCashMovement.total, rowsPerPage]);

  useEffect(() => {
    onRefresh((type || undefined) as CashMovementType | undefined, page, rowsPerPage);
  }, [type, page, rowsPerPage]);

  return (
    <div className="space-y-4">
      <div className="w-56">
        <SelectCustom
          label=""
          options={typeFilterOptions}
          selected={typeFilterOptions.find((opt) => opt.id === type) ?? null}
          onSelect={(value) => {
            if (value && !Array.isArray(value)) setType(value.id);
          }}
        />
      </div>
      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="sticky right-0 z-10 bg-card">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataCashMovement.data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span className={item.type === CashMovementType.EXPENSE ? 'text-destructive font-medium' : 'text-secondary-600 font-medium'}>
                  {CashMovementType[item.type as unknown as keyof typeof CashMovementType]}
                </span>
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                {item.type === CashMovementType.EXPENSE ? '- ' : '+ '}Bs. {item.amount.toFixed(2)}
              </TableCell>
              <TableCell>{item.payMethod}</TableCell>
              <TableCell>{format(new Date(item.createdAt), 'dd-MMMM-yyyy HH:mm', { locale: es })}</TableCell>
              <TableCell className="sticky right-0 z-10 bg-card">
                <ActionButtons
                  item={item}
                  onDelete={
                    hasPermission(
                      TypeAction.delete,
                      item.type === CashMovementType.EXPENSE ? TypeSubject.expenses : TypeSubject.income,
                    )
                      ? () => onDelete(item.id, item.type)
                      : undefined
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationControls
        total={dataCashMovement.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
};

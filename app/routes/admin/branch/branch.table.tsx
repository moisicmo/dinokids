import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type BranchModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (branch: BranchModel) => void;
  limitInit?: number;
  dataBranch: BaseResponse<BranchModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const BranchTable = (props: Props) => {
  const {
    handleEdit,
    limitInit = 10,
    dataBranch,
    onRefresh,
    onDelete,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const { hasPermission } = usePermissionStore();
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataBranch.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataBranch.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar sucursal..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataBranch.data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{`${item.address.city.name} ${item.address.zone}/${item.address.detail}`}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell className="sticky right-0 z-10 bg-white">
                <ActionButtons
                  item={item}
                  onEdit={hasPermission(TypeAction.update, TypeSubject.branch) ? handleEdit : undefined}
                  onDelete={hasPermission(TypeAction.delete, TypeSubject.branch) ? onDelete : undefined}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataBranch.total}
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

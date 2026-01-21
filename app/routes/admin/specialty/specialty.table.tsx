import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type BranchSpecialtiesModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (branchSpecialty: BranchSpecialtiesModel) => void;
  limitInit?: number;
  dataSpecialty: BaseResponse<BranchSpecialtiesModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const SpecialtyTable = (props: Props) => {
  const {
    handleEdit,
    limitInit = 10,
    dataSpecialty: dataBranchSpecialty,
    onRefresh,
    onDelete,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const { hasPermission } = usePermissionStore();


  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataBranchSpecialty.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataBranchSpecialty.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery)
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar especialidad..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Número de sesiones</TableHead>
            <TableHead>Costo estimado por sesión</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataBranchSpecialty.data.map((branchSpecialty) => (
            <TableRow key={branchSpecialty.id}>
              <TableCell>{branchSpecialty.specialty.name}</TableCell>
              <TableCell>{branchSpecialty.numberSessions}</TableCell>
              <TableCell>{branchSpecialty.estimatedSessionCost} Bs.</TableCell>
              <TableCell className="sticky right-0 z-10 bg-white">
                <ActionButtons
                  item={branchSpecialty}
                  onEdit={hasPermission(TypeAction.update, TypeSubject.specialty) ? handleEdit : undefined}
                  onDelete={hasPermission(TypeAction.delete, TypeSubject.specialty) ? onDelete : undefined}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataBranchSpecialty.total}
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

import { useEffect, useState } from 'react';
import type { BaseResponse, TutorModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (user: TutorModel) => void;
  limitInit?: number;
  itemSelect?: (user: TutorModel) => void;
  dataTutor: BaseResponse<TutorModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const TutorTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
    dataTutor,
    onRefresh,
    onDelete,
  } = props;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataTutor.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataTutor.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar tutor..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {/* Tabla en desktop */}
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Número de documento</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Zona</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataTutor.data.map(item => (
            <TableRow key={item.userId}>
              <TableCell>{item.user.numberDocument}</TableCell>
              <TableCell>{item.user.name}</TableCell>
              <TableCell>{item.user.lastName}</TableCell>
              <TableCell>{item.user.email}</TableCell>
              <TableCell>{item.user.phone}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.zone}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell className="sticky right-0 z-10 bg-white">
                <ActionButtons
                  item={item}
                  onEdit={handleEdit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataTutor.total}
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

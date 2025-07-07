import { useEffect, useState } from 'react';
import type { BaseResponse, TeacherModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (teacher: TeacherModel) => void;
  limitInit?: number;
  itemSelect?: (teacher: TeacherModel) => void;
  dataTeacher: BaseResponse<TeacherModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const TeacherTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
    dataTeacher,
    onRefresh,
    onDelete,
  } = props;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataTeacher.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataTeacher.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar profesor..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Número de documento</TableHead>
            <TableHead>Nombre y Apellido</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Zona</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Estado académico</TableHead>
            <TableHead>Fecha de inicio</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataTeacher.data.map(item => (
            <TableRow key={item.userId}>
              <TableCell>{item.user.numberDocument}</TableCell>
              <TableCell>{`${item.major} ${item.user.name} ${item.user.lastName}`}</TableCell>
              <TableCell>{item.user.email}</TableCell>
              <TableCell>{item.user.phone}</TableCell>
              <TableCell>{item.zone}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.academicStatus}</TableCell>
              <TableCell>
                {format(new Date(item.startJob), 'dd-MMMM-yyyy', { locale: es })}

              </TableCell>
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
        total={dataTeacher.total}
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

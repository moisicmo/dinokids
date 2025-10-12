import { useEffect, useState } from 'react';
import type { BaseResponse, RoomModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { CalendarClock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScheduleView } from '.';

interface Props {
  handleEdit: (room: RoomModel) => void;
  limitInit?: number;
  itemSelect?: (room: RoomModel) => void;
  dataRoom: BaseResponse<RoomModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const RoomTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
    dataRoom,
    onRefresh,
    onDelete,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataRoom.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataRoom.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  const [room, setRoom] = useState<RoomModel>();
  const [dialog, setDialog] = useState(false);

  return (
    <>
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
              <TableHead>Sucursal</TableHead>
              <TableHead>Rango de edad</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Profesor</TableHead>
              <TableHead>Auxiliar</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Horario</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataRoom.data.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.branch.name}</TableCell>
                <TableCell>
                  {item.rangeYears?.length === 2
                    ? item.rangeYears[0] === item.rangeYears[1]
                      ? `${item.rangeYears[0]} años`
                      : `${item.rangeYears[0]} a ${item.rangeYears[1]} años`
                    : 'No especificado'}
                </TableCell>
                <TableCell>{item.specialty.name}</TableCell>
                <TableCell>{item.teacher.user.name}</TableCell>
                <TableCell>{item.assistant.user.name}</TableCell>
                <TableCell>
                  <button
                    onClick={() => setRoom(item)}
                    title="Horario" className="cursor-pointer">
                    <CalendarClock color="var(--color-info)" className="w-5 h-5" />
                  </button>
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
          total={dataRoom.total}
          page={page}
          limit={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newLimit) => {
            setRowsPerPage(newLimit);
            setPage(1);
          }}
        />
      </div>
      {room && (
        <ScheduleView
          open={room != null}
          handleClose={() => setRoom(undefined)}
          room={room}
        />
      )}
    </>
  );
};

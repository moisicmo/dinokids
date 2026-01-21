import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type RoomModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { CalendarClock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScheduleView } from '.';

interface Props {
  handleEdit: (room: RoomModel) => void;
  limitInit?: number;
  dataRoom: BaseResponse<RoomModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const RoomTable = (props: Props) => {
  const {
    handleEdit,
    limitInit = 10,
    dataRoom,
    onRefresh,
    onDelete,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const { hasPermission } = usePermissionStore();

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
              <TableHead>Rango de edad</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Profesor</TableHead>
              <TableHead>Auxiliar</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Horario</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataRoom.data.map(room => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>
                  {room.rangeYears?.length === 2
                    ? room.rangeYears[0] === room.rangeYears[1]
                      ? `${room.rangeYears[0]} años`
                      : `${room.rangeYears[0]} a ${room.rangeYears[1]} años`
                    : 'No especificado'}
                </TableCell>
                <TableCell>{room.specialty.name}</TableCell>
                <TableCell>{room.teacher.user.name}</TableCell>
                <TableCell>{room.assistant.user.name}</TableCell>
                <TableCell>
                  <button
                    onClick={() => setRoom(room)}
                    title="Horario" className="cursor-pointer">
                    <CalendarClock color="var(--color-info)" className="w-5 h-5" />
                  </button>
                </TableCell>
                <TableCell className="sticky right-0 z-10 bg-white">
                  <ActionButtons
                    item={room}
                    onEdit={hasPermission(TypeAction.update, TypeSubject.room) ? handleEdit : undefined}
                    onDelete={hasPermission(TypeAction.delete, TypeSubject.room) ? onDelete : undefined}
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

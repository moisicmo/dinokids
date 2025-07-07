import { useEffect, useState } from 'react';
import { type BaseResponse, type InscriptionModel } from '@/models';
import { useDebounce, useEnums } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (inscription: InscriptionModel) => void;
  limitInit?: number;
  itemSelect?: (inscription: InscriptionModel) => void;
  dataBooking: BaseResponse<InscriptionModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const BookingTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
    dataBooking,
    onRefresh,
    onDelete
  } = props;

  const { getDay } = useEnums();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataBooking.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataBooking.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar reserva..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Número de documento</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Cant. días</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Asignaciones</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataBooking.data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.booking?.dni}</TableCell>
              <TableCell>{item.booking?.name}</TableCell>
              <TableCell>{`${item.booking?.days} días`}</TableCell>
              <TableCell>{`${item.booking?.amount} Bs`}</TableCell>
              <TableCell>
                <div className="flex flex-col space-y-4">
                  {item.assignmentRooms.map((assignmentRoom) => (
                    <div
                      key={assignmentRoom.id}
                      className="border border-gray-200 rounded-md p-3 shadow-sm bg-gray-50"
                    >
                      <p className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                        <CalendarClock className="w-4 h-4 text-gray-500" />
                        {`${assignmentRoom.room.branch.name} - ${assignmentRoom.room.name} - ${assignmentRoom.room.specialty.name}`}
                      </p>
                      <p className="text-xs text-gray-600 italic">
                        Inicio: {format(new Date(assignmentRoom.start), 'dd-MMMM-yyyy', { locale: es })}
                      </p>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                        {assignmentRoom.assignmentSchedules.map((schedule) => (
                          <li key={schedule.id}>
                            {`${getDay(schedule.day)} de ${format(new Date(schedule.schedule.start), 'HH:mm', { locale: es })} a ${format(new Date(schedule.schedule.end), 'HH:mm', { locale: es })}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
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
        total={dataBooking.total}
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

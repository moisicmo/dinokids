import { useEffect, useState } from 'react';
import { DayOfWeek, type BookingModel, type InscriptionModel } from '@/models';
import { useBookingStore, useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  handleEdit: (inscription: InscriptionModel) => void;
  limitInit?: number;
  itemSelect?: (inscription: InscriptionModel) => void;
}

export const BookingTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataBooking, getBookings, deleteBooking } = useBookingStore();

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
    getBookings(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  const dayOptions = Object.entries(DayOfWeek).map(([key, value]) => ({
    key,
    label: value,
  }));
  const getDayLabel = (day: string) => {
    const found = dayOptions.find(d => d.key === day);
    return found?.label ?? day;
  };

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

      <div className="overflow-x-auto rounded-lg pb-3">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 text-xs">
            <tr>
              <th className="px-6 py-3">Núm. Doc</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Cant. días</th>
              <th className="px-6 py-3">Monto</th>
              <th className="px-6 py-3">Asignaciones</th>
              <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataBooking.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 group">
                <td className="px-6 py-3">{item.booking?.dni}</td>
                <td className="px-6 py-3">{item.booking?.name}</td>
                <td className="px-6 py-3">{item.booking?.days}</td>
                <td className="px-6 py-3">{item.booking?.amount}</td>
                <td className="px-6 py-3">
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
                              {`${getDayLabel(schedule.day)} de ${format(new Date(schedule.schedule.start), 'HH:mm', { locale: es })} a ${format(new Date(schedule.schedule.end), 'HH:mm', { locale: es })}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <ActionButtons
                    item={item}
                    onEdit={handleEdit}
                    onDelete={deleteBooking}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

import { useEffect, useState } from 'react';
import type { RoomModel } from '@/models';
import { useRoomStore, useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { CalendarClock } from 'lucide-react';

interface Props {
  handleEdit: (room: RoomModel) => void;
  limitInit?: number;
  itemSelect?: (room: RoomModel) => void;
}

export const RoomTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataRoom, getRooms, deleteRoom } = useRoomStore();

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
    getRooms(page, rowsPerPage, debouncedQuery);
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

      <div className="overflow-x-auto rounded-lg pb-3">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Sucursal</th>
              <th className="px-6 py-3">Capacidad</th>
              <th className="px-6 py-3">Rango de edad</th>
              <th className="px-6 py-3">Especialidad</th>
              <th className="px-6 py-3">Profesor</th>
              <th className="px-2 py-3 sticky right-0 bg-gray-100 z-10">Horario</th>
              <th className="px-2 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataRoom.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 group">
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">{item.branch.name}</td>
                <td className="px-6 py-3">{item.capacity}</td>
                <td className="px-6 py-3">
                  {item.rangeYears?.length === 2
                    ? item.rangeYears[0] === item.rangeYears[1]
                      ? `${item.rangeYears[0]} años`
                      : `${item.rangeYears[0]} a ${item.rangeYears[1]} años`
                    : 'No especificado'}
                </td>
                <td className="px-6 py-3">{item.specialty.name}</td>
                <td className="px-6 py-3">{item.teacher.user.name}</td>
                <td className="px-2 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <button onClick={() => { }} title="Horario" className="cursor-pointer">
                    <CalendarClock color="var(--color-info)" className="w-5 h-5" />
                  </button>
                </td>
                <td className="px-2 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <ActionButtons
                    item={item}
                    onEdit={handleEdit}
                    onDelete={deleteRoom}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  );
};

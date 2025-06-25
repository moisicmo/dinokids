import { useEffect, useState } from 'react';
import type { RoomModel } from '@/models';
import { useRoomStore, useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';

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

      {/* Tabla en desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Sucursal</th>
              <th className="px-6 py-3">Capacidad</th>
              <th className="px-6 py-3">Rango de edad</th>
              <th className="px-6 py-3">Especialidad</th>
              <th className="px-6 py-3">Profesor</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataRoom.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
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
                <td className="px-6 py-3">
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

      {/* Tabla en móvil */}
      <div className="md:hidden space-y-4">
        {dataRoom.data.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div className="space-y-1">
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Nombre:</span>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Capacidad:</span>
                  <span className="font-medium text-gray-900">{item.capacity}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Rango de edad:</span>
                  <span className="font-medium text-gray-900 break-all">
                    {item.rangeYears?.length === 2
                      ? item.rangeYears[0] === item.rangeYears[1]
                        ? `${item.rangeYears[0]} años`
                        : `${item.rangeYears[0]} a ${item.rangeYears[1]} años`
                      : 'No especificado'}
                  </span>


                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Especialidad:</span>
                  <span className="font-medium text-gray-900 break-all">{item.specialty.name}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Profesor:</span>
                  <span className="font-medium text-gray-900 break-all">{item.teacher.user.name}</span>
                </div>
              </div>
              <ActionButtons
                item={item}
                onEdit={handleEdit}
                onDelete={deleteRoom}
              />
            </div>
          </div>
        ))}
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

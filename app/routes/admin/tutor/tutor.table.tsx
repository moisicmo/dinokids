import { useEffect, useState } from 'react';
import type { UserModel } from '@/models';
import { useDebounce, useTutorStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';

interface Props {
  handleEdit: (user: UserModel) => void;
  limitInit?: number;
  itemSelect?: (user: UserModel) => void;
}

export const TutorTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataTutor, getTutors, deleteTutor } = useTutorStore();
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
    getTutors(page, rowsPerPage, debouncedQuery);
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
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Número de documento</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Apellido</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3">Ciudad</th>
              <th className="px-6 py-3">Zona</th>
              <th className="px-6 py-3">Dirección</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataTutor.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{item.numberDocument}</td>
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">{item.lastName}</td>
                <td className="px-6 py-3">{item.email}</td>
                <td className="px-6 py-3">{item.phone}</td>
                <td className="px-6 py-3">{item.tutor?.city}</td>
                <td className="px-6 py-3">{item.tutor?.zone}</td>
                <td className="px-6 py-3">{item.tutor?.address}</td>
                <td className="px-6 py-3">
                  <ActionButtons item={item} onEdit={handleEdit} onDelete={deleteTutor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla en móvil */}
      <div className="md:hidden space-y-4">
        {dataTutor.data.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div className="space-y-1">
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">N° Doc:</span>
                  <span className="font-medium text-gray-900">{item.numberDocument}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Nombre:</span>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Apellido:</span>
                  <span className="font-medium text-gray-900">{item.lastName}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Correo:</span>
                  <span className="font-medium text-gray-900 break-all">{item.email}</span>
                </div>
                {
                  item.phone &&
                  <div className="flex text-sm">
                    <span className="w-20 text-gray-500">Teléfono:</span>
                    <span className="font-medium text-gray-900 break-all">{item.phone}</span>
                  </div>
                }
                {
                  item.tutor &&
                  <>
                    <div className="flex text-sm">
                      <span className="w-20 text-gray-500">Ciudad:</span>
                      <span className="font-medium text-gray-900 break-all">{item.tutor.city}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="w-20 text-gray-500">Zona:</span>
                      <span className="font-medium text-gray-900 break-all">{item.tutor.zone}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="w-20 text-gray-500">Direccion:</span>
                      <span className="font-medium text-gray-900 break-all">{item.tutor.address}</span>
                    </div>
                  </>
                }
              </div>
              <ActionButtons item={item} onEdit={handleEdit} onDelete={deleteTutor} />
            </div>
          </div>
        ))}
      </div>
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

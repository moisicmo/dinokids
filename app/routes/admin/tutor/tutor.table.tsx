import { useEffect, useState } from 'react';
import type { TutorModel } from '@/models';
import { useDebounce, useTutorStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';

interface Props {
  handleEdit: (user: TutorModel) => void;
  limitInit?: number;
  itemSelect?: (user: TutorModel) => void;
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
      <div className="overflow-x-auto rounded-lg pb-3">
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
              <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataTutor.data.map((item) => (
              <tr key={item.userId} className="border-b hover:bg-gray-50 group">
                <td className="px-6 py-3">{item.user.numberDocument}</td>
                <td className="px-6 py-3">{item.user.name}</td>
                <td className="px-6 py-3">{item.user.lastName}</td>
                <td className="px-6 py-3">{item.user.email}</td>
                <td className="px-6 py-3">{item.user.phone}</td>
                <td className="px-6 py-3">{item.city}</td>
                <td className="px-6 py-3">{item.zone}</td>
                <td className="px-6 py-3">{item.address}</td>
                <td className="px-6 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <ActionButtons item={item} onEdit={handleEdit} onDelete={deleteTutor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

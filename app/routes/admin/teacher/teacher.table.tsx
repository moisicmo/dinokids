import { useEffect, useState } from 'react';
import type { UserModel } from '@/models';
import { useDebounce, useTeacherStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  handleEdit: (user: UserModel) => void;
  limitInit?: number;
  itemSelect?: (user: UserModel) => void;
}

export const TeacherTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataTeacher, getTeachers, deleteTeacher } = useTeacherStore();
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
    getTeachers(page, rowsPerPage, debouncedQuery);
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

      <div className="overflow-x-auto rounded-lg pb-3">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">N de documento</th>
              <th className="px-6 py-3 ">Nombre</th>
              <th className="px-6 py-3">Apellido</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3">Zona</th>
              <th className="px-6 py-3">Dirección</th>
              <th className="px-6 py-3">Titulo</th>
              <th className="px-6 py-3">Estado Académico</th>
              <th className="px-6 py-3">Fecha de inicio</th>
              <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataTeacher.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 group">
                <td className="px-6 py-3">{item.numberDocument}</td>
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">{item.lastName}</td>
                <td className="px-6 py-3">{item.email}</td>
                <td className="px-6 py-3">{item.phone}</td>
                <td className="px-6 py-3">{item.teacher?.zone}</td>
                <td className="px-6 py-3">{item.teacher?.address}</td>
                <td className="px-6 py-3">{item.teacher?.major}</td>
                <td className="px-6 py-3">{item.teacher?.academicStatus}</td>
                <td className="px-6 py-3">
                  {item.teacher ? format(new Date(item.teacher.startJob), 'dd-MMMM-yyyy', { locale: es }) : ''}
                </td>
                <td className="px-6 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <ActionButtons item={item} onEdit={handleEdit} onDelete={deleteTeacher} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

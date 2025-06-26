import { useEffect, useState } from 'react';
import type { UserModel } from '@/models';
import { useDebounce, useStudentStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  handleEdit: (user: UserModel) => void;
  limitInit?: number;
  itemSelect?: (user: UserModel) => void;
}

export const StudentTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataStudent, getStudents, deleteStudent } = useStudentStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataStudent.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataStudent.total, rowsPerPage]);

  useEffect(() => {
    getStudents(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar estudiante..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg pb-3">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Número de documento</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Apellido</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Fecha de nacimiento</th>
              <th className="px-6 py-3">Género</th>
              <th className="px-6 py-3">Colegio</th>
              <th className="px-6 py-3">Grado</th>
              <th className="px-6 py-3">Nivel</th>
              <th className="px-6 py-3">Tutores</th>
              <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataStudent.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 group">
                <td className="px-6 py-3">{item.student?.code}</td>
                <td className="px-6 py-3">{item.numberDocument}</td>
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">{item.lastName}</td>
                <td className="px-6 py-3">{item.email}</td>
                <td className="px-6 py-3">
                  {item.student ? format(new Date(item.student.birthdate), 'dd-MMMM-yyyy', { locale: es }) : ''}
                </td>
                <td className="px-6 py-3">{item.student?.gender}</td>
                <td className="px-6 py-3">{item.student?.school}</td>
                <td className="px-6 py-3">{item.student?.grade}</td>
                <td className="px-6 py-3">{item.student?.educationLevel}</td>
                <td className="px-6 py-3">
                  <ul className="list-disc list-inside space-y-1">
                    {
                      item.student?.tutors.map((tutor) => (
                        <li key={tutor.id}>
                          {tutor.user?.name}
                        </li>))
                    }
                  </ul>
                </td>
                <td className="px-6 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <ActionButtons item={item} onEdit={handleEdit} onDelete={deleteStudent} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataStudent.total}
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

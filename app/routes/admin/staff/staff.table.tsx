import { useEffect, useState } from 'react';
import type { UserModel } from '@/models';
import { useDebounce, useStaffStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';

interface Props {
  handleEdit: (user: UserModel) => void;
  limitInit?: number;
  itemSelect?: (user: UserModel) => void;
}

export const StaffTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataStaff, getStaffs, deleteStaff } = useStaffStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataStaff.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataStaff.total, rowsPerPage]);

  useEffect(() => {
    getStaffs(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar staff..."
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
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataStaff.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{item.numberDocument}</td>
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">{item.lastName}</td>
                <td className="px-6 py-3">{item.email}</td>
                <td className="px-6 py-3">{item.phone}</td>
                <td className="px-6 py-3">{item.staff?.role.name}</td>
                <td className="px-6 py-3">
                  <ActionButtons item={item} onEdit={handleEdit} onDelete={deleteStaff} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla en móvil */}
      <div className="md:hidden space-y-4">
        {dataStaff.data.map((item) => (
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
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Rol:</span>
                  <span className="font-medium text-gray-900">{item.staff?.role.name}</span>
                </div>
              </div>
              <ActionButtons item={item} onEdit={handleEdit} onDelete={deleteStaff} />
            </div>
          </div>
        ))}
      </div>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataStaff.total}
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

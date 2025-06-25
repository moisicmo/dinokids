import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type RoleModel } from '@/models';
import { useRoleStore, useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';

interface Props {
  handleEdit: (role: RoleModel) => void;
  limitInit?: number;
  itemSelect?: (role: RoleModel) => void;
}

export const RoleTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataRole, getRoles, deleteRole } = useRoleStore();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataRole.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataRole.total, rowsPerPage]);

  useEffect(() => {
    getRoles(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar rol..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Tabla en desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Permisos</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataRole.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">
                  <ul className="list-disc list-inside space-y-1">
                    {
                      item.permissions.map((perm) => (
                        <li key={perm.id}>
                          {`${TypeAction[perm.action as unknown as keyof typeof TypeAction]} ${TypeSubject[perm.subject as unknown as keyof typeof TypeSubject]}`}
                        </li>))
                    }
                  </ul>
                </td>
                <td className="px-6 py-3">
                  <ActionButtons
                    item={item}
                    onEdit={handleEdit}
                    onDelete={deleteRole}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla en móvil */}
      <div className="md:hidden space-y-4">
        {dataRole.data.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div className="space-y-1">
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Nombre:</span>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Permisos:</span>
                  <span className="font-medium text-gray-900">
                    {
                      item.permissions.map((perm) => (
                        <li key={perm.id}>{`${perm.action} ${perm.subject}`}</li>
                      ))
                    }
                  </span>
                </div>

              </div>
              <ActionButtons
                item={item}
                onEdit={handleEdit}
                onDelete={deleteRole}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataRole.total}
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

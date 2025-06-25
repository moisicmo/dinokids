import { useEffect, useState } from 'react';
import type { BranchModel, BranchSpecialtiesModel, SpecialtyModel, SpecialtyResponse } from '@/models';
import { useSpecialtyStore, useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';

interface Props {
  handleEdit: (specialty: SpecialtyModel) => void;
  limitInit?: number;
  itemSelect?: (specialty: SpecialtyModel) => void;
}

export const SpecialtyTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataSpecialty, getSpecialties, deleteSpecialty } = useSpecialtyStore();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataSpecialty.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataSpecialty.total, rowsPerPage]);

  useEffect(() => {
    getSpecialties(page, rowsPerPage, debouncedQuery)
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar especialidad..."
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
              <th className="px-6 py-3">Número de sesiones</th>
              <th className="px-6 py-3">Costo estimado por sesión</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataSpecialty.data.map((specialty) => specialty.branchSpecialties.map((branchSpecialty) => (
              <tr key={branchSpecialty.specialty.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{branchSpecialty.specialty.name}</td>
                <td className="px-6 py-3">{branchSpecialty.branch.name}</td>
                <td className="px-6 py-3">{branchSpecialty.numberSessions}</td>
                <td className="px-6 py-3">{branchSpecialty.estimatedSessionCost}</td>
                <td className="px-6 py-3">
                  <ActionButtons
                    item={specialty}
                    onEdit={handleEdit}
                    onDelete={deleteSpecialty}
                  />
                </td>
              </tr>)))}
          </tbody>
        </table>
      </div>

      {/* Tabla en móvil */}
      <div className="md:hidden space-y-4">
        {dataSpecialty.data.map((specialty) => specialty.branchSpecialties.map((branchSpecialty) => (
          <div key={branchSpecialty.specialty.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div className="space-y-1">
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Nombre:</span>
                  <span className="font-medium text-gray-900">{branchSpecialty.specialty.name}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Sucursal:</span>
                  <span className="font-medium text-gray-900">{branchSpecialty.branch.name}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Número de sesiones:</span>
                  <span className="font-medium text-gray-900">{branchSpecialty.numberSessions}</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-20 text-gray-500">Costo estimado por sesión:</span>
                  <span className="font-medium text-gray-900 break-all">{branchSpecialty.estimatedSessionCost}</span>
                </div>
              </div>
              <ActionButtons
                item={specialty}
                onEdit={handleEdit}
              onDelete={deleteSpecialty}
              />
            </div>
          </div>
        )))}
      </div>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataSpecialty.total}
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

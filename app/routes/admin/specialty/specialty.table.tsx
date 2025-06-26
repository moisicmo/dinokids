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

      <div className="overflow-x-auto rounded-lg pb-3">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Sucursal</th>
              <th className="px-6 py-3">Número de sesiones</th>
              <th className="px-6 py-3">Costo estimado por sesión</th>
              <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataSpecialty.data.map((specialty) => specialty.branchSpecialties.map((branchSpecialty) => (
              <tr key={branchSpecialty.specialty.id} className="border-b hover:bg-gray-50 group">
                <td className="px-6 py-3">{branchSpecialty.specialty.name}</td>
                <td className="px-6 py-3">{branchSpecialty.branch.name}</td>
                <td className="px-6 py-3">{branchSpecialty.numberSessions}</td>
                <td className="px-6 py-3">{branchSpecialty.estimatedSessionCost}</td>
                <td className="px-6 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <ActionButtons
                    item={specialty}
                    onEdit={handleEdit}
                    onDelete={deleteSpecialty}
                  />
                </td>
              </tr>
            )))}
          </tbody>
        </table>
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

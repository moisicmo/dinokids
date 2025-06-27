import { useEffect, useState } from 'react';
import type { InscriptionModel } from '@/models';
import { useInscriptionStore, useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';

interface Props {
  handleEdit: (inscription: InscriptionModel) => void;
  limitInit?: number;
  itemSelect?: (inscription: InscriptionModel) => void;
}

export const InscriptionTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
  } = props;

  const { dataInscription, getInscriptions, deleteInscription } = useInscriptionStore();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataInscription.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataInscription.total, rowsPerPage]);

  useEffect(() => {
    getInscriptions(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar inscripción..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg pb-3">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Dirección</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataInscription.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 group">
                <td className="px-6 py-3">{item.student?.user.name}</td>
                <td className="px-6 py-3">{item.prices[0].inscriptionPrice}</td>
                <td className="px-6 py-3">{item.prices[0].monthPrice}</td>
                <td className="px-6 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <ActionButtons
                    item={item}
                    onEdit={handleEdit}
                    onDelete={deleteInscription}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <PaginationControls
        total={dataInscription.total}
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

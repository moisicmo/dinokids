import { useEffect, useState } from 'react';
import { useDebtStore, useDebounce, useEnums } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';

interface Props {
  limitInit?: number;
}

export const DebtTable = (props: Props) => {
  const {
    limitInit = 10,
  } = props;

  const { dataDebt, getDebts } = useDebtStore();
  const { getTypeDebt, getTypeDebtClass } = useEnums();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataDebt.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataDebt.total, rowsPerPage]);

  useEffect(() => {
    getDebts(page, rowsPerPage, debouncedQuery);
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

      <div className="overflow-x-auto rounded-lg pb-3">
        <table className="min-w-max text-sm text-left w-full">
          <thead className="bg-gray-100 text-gray-700 text-xs">
            <tr>
              <th className="px-6 py-3">Cod. Estudiante</th>
              <th className="px-6 py-3">Estudiante</th>
              <th className="px-6 py-3">Deuda Total</th>
              <th className="px-6 py-3">Saldo restante</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3 sticky right-0 bg-gray-100 z-10">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataDebt.data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 group">
                <td className="px-6 py-3">{item.inscription.student?.code}</td>
                <td className="px-6 py-3">
                  {
                    item.inscription.student
                      ? `${item.inscription.student.user.name} ${item.inscription.student.user.lastName}`
                      : item.inscription.booking?.name
                  }
                </td>
                <td className="px-6 py-3">{`${item.totalAmount} Bs.`}</td>
                <td className="px-6 py-3">{`${item.remainingBalance} Bs`}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeDebtClass(item.type)}`}>
                    {getTypeDebt(item.type)}
                  </span>
                </td>
                <td className="px-6 py-3 sticky right-0 bg-white z-10 group-hover:bg-gray-50">
                  <ActionButtons
                    item={item}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <PaginationControls
        total={dataDebt.total}
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

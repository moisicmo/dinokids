import { useEffect, useState } from 'react';
import { useAuthStore, useCashBoxStore } from '@/hooks';
import type { CashBoxSessionDetailModel } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { CashBoxTable } from './cash-box.table';

const cashBoxView = () => {
  const { branchSelect } = useAuthStore();
  const { dataHistory, getHistory, getSessionDetail } = useCashBoxStore();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailsById, setDetailsById] = useState<Record<string, CashBoxSessionDetailModel>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!branchSelect?.id) return;
    getHistory(branchSelect.id, page, rowsPerPage);
  }, [branchSelect?.id, page, rowsPerPage]);

  useEffect(() => {
    if (!branchSelect?.id) return;
    const handler = () => getHistory(branchSelect.id, page, rowsPerPage);
    window.addEventListener('cashbox-state-changed', handler);
    return () => window.removeEventListener('cashbox-state-changed', handler);
  }, [branchSelect?.id, page, rowsPerPage]);

  const handleToggleRow = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (detailsById[id]) return;
    setLoadingId(id);
    try {
      const detail = await getSessionDetail(id);
      setDetailsById((prev) => ({ ...prev, [id]: detail }));
    } finally {
      setLoadingId(null);
    }
  };

  if (!branchSelect?.id) {
    return <p className="text-muted-foreground text-sm">Selecciona una sucursal para ver su historial de caja.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Historial de Caja</h2>

      <CashBoxTable
        sessions={dataHistory.data}
        expandedId={expandedId}
        detailsById={detailsById}
        loadingId={loadingId}
        onToggleRow={handleToggleRow}
      />

      <PaginationControls
        total={dataHistory.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
};

export default cashBoxView;

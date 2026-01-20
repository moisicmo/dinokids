import { useEffect, useState } from 'react';
import type { BaseResponse, DocumentTransmissionModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import type { Evaluation } from './model';

interface Props {
  limitInit?: number;
  itemSelect?: (branch: DocumentTransmissionModel) => void;
  dataCorrespondence: BaseResponse<DocumentTransmissionModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onView: (documentTransmission: DocumentTransmissionModel) => void;
}

export const CorrespondenceTable = (props: Props) => {
  const {
    itemSelect,
    limitInit = 10,
    dataCorrespondence,
    onRefresh,
    onView,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataCorrespondence.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataCorrespondence.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar correspondencia..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Documento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataCorrespondence.data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.document.type}</TableCell>
              <TableCell>
                <button onClick={() => onView(item)} title="ver" className="cursor-pointer">
                  <Eye color="var(--color-info)" className="w-5 h-5" />
                </button>
              </TableCell>
              <TableCell className="sticky right-0 z-10 bg-white">
                <ActionButtons
                  item={item}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataCorrespondence.total}
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

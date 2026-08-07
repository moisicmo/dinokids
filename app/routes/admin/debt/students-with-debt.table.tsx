import { useEffect, useState } from 'react';
import React from 'react';
import type { BaseResponse, StudentModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DebtTable } from '../student';

interface Props {
  dataStudentsWithDebt: BaseResponse<StudentModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  limitInit?: number;
}

export const StudentsWithDebtTable = ({ dataStudentsWithDebt, onRefresh, limitInit = 10 }: Props) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataStudentsWithDebt.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataStudentsWithDebt.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  const handleSelect = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <InputCustom
        name="query"
        value={query}
        placeholder="Buscar estudiante..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Num. documento</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Colegio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataStudentsWithDebt.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                Ningún estudiante tiene deudas pendientes.
              </TableCell>
            </TableRow>
          )}
          {dataStudentsWithDebt.data.map((item) => (
            <React.Fragment key={item.userId}>
              <TableRow>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.user.numberDocument}</TableCell>
                <TableCell>{`${item.user.name} ${item.user.lastName}`}</TableCell>
                <TableCell>{item.school?.name}</TableCell>
                <TableCell>
                  <ActionButtons
                    item={item}
                    onSelect={handleSelect}
                    isSelected={expandedId === item.userId}
                  />
                </TableCell>
              </TableRow>
              {expandedId === item.userId && (
                <TableRow className="bg-muted">
                  <TableCell colSpan={5} className="p-0">
                    <DebtTable studentId={item.userId} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        total={dataStudentsWithDebt.total}
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

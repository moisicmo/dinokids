import { useEffect, useState } from 'react';
import { type BaseResponse, type StudentModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import React from 'react';
import { DebtTable } from '.';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (student: StudentModel) => void;
  limitInit?: number;
  itemSelect?: (student: StudentModel) => void;
  dataStudent: BaseResponse<StudentModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const StudentTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
    dataStudent,
    onRefresh,
    onDelete,
  } = props;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataStudent.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataStudent.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  const handleSelect = async (id: string) => {
    if (expandedId === id) {
      // Si ya está abierto, ciérralo
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
  };

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
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Num. documento</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Colegio</TableHead>
            <TableHead>Grado</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataStudent.data.map((item) => (
            <React.Fragment key={item.userId}>
              <TableRow>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.user.numberDocument}</TableCell>
                <TableCell>{`${item.user.name} ${item.user.lastName}`}</TableCell>
                <TableCell>{item.user.email}</TableCell>
                <TableCell>{item.school.name}</TableCell>
                <TableCell>{`${item.grade}º ${item.educationLevel}`}</TableCell>
                <TableCell className="sticky right-0 z-10 bg-white">
                  <ActionButtons
                    item={item}
                    onSelect={handleSelect}
                    isSelected={expandedId === item.userId}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
              {expandedId === item.userId && (
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={12} className="p-0">
                    <DebtTable studentId={expandedId} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

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
import { useEffect, useState } from 'react';
import { StudentStatus, TypeAction, TypeSubject, type BaseResponse, type StudentModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom, SelectCustom, type ValueSelect } from '@/components';
import { DocumentEditor } from '.';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (student: StudentModel) => void;
  limitInit?: number;
  dataStudent: BaseResponse<StudentModel>;
  onRefresh: (page?: number, limit?: number, keys?: string, status?: string) => void;
  onDelete: (id: string) => void;
  onSessionTracking?: (student: StudentModel) => void;
  onWeeklyPlanning?: (student: StudentModel) => void;
  onEvaluationPlanning?: (student: StudentModel) => void;
}

const statusOptions: ValueSelect[] = Object.entries(StudentStatus).map(([key, value]) => ({ id: key, value }));
const statusFilterOptions: ValueSelect[] = [{ id: '', value: 'Todos los estados' }, ...statusOptions];

export const StudentTable = (props: Props) => {
  const {
    handleEdit,
    limitInit = 10,
    dataStudent,
    onRefresh,
    onDelete,
    onSessionTracking,
    onWeeklyPlanning,
    onEvaluationPlanning,
  } = props;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [reportStudent, setReportStudent] = useState<StudentModel | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { hasPermission } = usePermissionStore();
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataStudent.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataStudent.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery, status);
  }, [page, rowsPerPage, debouncedQuery, status]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar estudiante..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="w-48">
          <SelectCustom
            label=""
            options={statusFilterOptions}
            selected={statusFilterOptions.find((opt) => opt.id === status) ?? null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                setStatus(value.id);
              }
            }}
          />
        </div>
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
            <TableHead>Estado</TableHead>
            <TableHead className="sticky right-0 z-10 bg-card">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataStudent.data.map((item) => (
            <TableRow key={item.userId}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.user.numberDocument}</TableCell>
              <TableCell>{`${item.user.name} ${item.user.lastName}`}</TableCell>
              <TableCell>{item.user.email}</TableCell>
              <TableCell>{item.school?.name}</TableCell>
              <TableCell>{`${item?.grade}º ${item?.educationLevel}`}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell className="sticky right-0 z-10 bg-card">
                <ActionButtons
                  item={item}
                  onEdit={hasPermission(TypeAction.update, TypeSubject.student) ? handleEdit : undefined}
                  onDelete={hasPermission(TypeAction.delete, TypeSubject.student) ? onDelete : undefined}
                  onSessionTracking={hasPermission(TypeAction.create, TypeSubject.sessionTracking) ? onSessionTracking : undefined}
                  onWeeklyPlanning={hasPermission(TypeAction.create, TypeSubject.weeklyPlanning) ? onWeeklyPlanning : undefined}
                  onEvaluationPlanning={hasPermission(TypeAction.create, TypeSubject.evaluationPlanning) ? onEvaluationPlanning : undefined}
                  onReport={(s) => setReportStudent(s)}
                />
              </TableCell>
            </TableRow>
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

      {reportStudent && (
        <DocumentEditor
          student={reportStudent}
          onClose={() => setReportStudent(null)}
          onSessionTracking={onSessionTracking}
          onWeeklyPlanning={onWeeklyPlanning}
          onEvaluationPlanning={onEvaluationPlanning}
        />
      )}
    </div>
  );
};
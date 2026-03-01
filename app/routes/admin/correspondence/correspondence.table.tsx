import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type DocumentTransmissionModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Eye,
  ClipboardCheck,
  CalendarDays,
  ListChecks,
  BookOpen,
  BarChart2,
} from 'lucide-react';

interface Props {
  limitInit?: number;
  dataCorrespondence: BaseResponse<DocumentTransmissionModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onView: (item: DocumentTransmissionModel) => void;
  onEvaluate?: (item: DocumentTransmissionModel, catalogId: string) => void;
  onSessionTracking?: (item: DocumentTransmissionModel) => void;
  onWeeklyPlanning?: (item: DocumentTransmissionModel) => void;
  onEvaluationPlanning?: (item: DocumentTransmissionModel) => void;
  onReport?: (item: DocumentTransmissionModel) => void;
}

const EVAL_BUTTONS = [
  { subject: TypeSubject.evaluationCondoctual, catalogId: 'conductual', label: 'Kinder (v2)' },
  { subject: TypeSubject.evaluationKinder, catalogId: 'kinder', label: 'Psicopedagógica' },
  { subject: TypeSubject.evaluation123Primaria, catalogId: 'primaria-1-3', label: '1-3 Primaria' },
  { subject: TypeSubject.evaluation456Primaria, catalogId: 'primaria-4-6', label: '4-6 Primaria' },
  { subject: TypeSubject.evaluation123Secundaria, catalogId: 'secundaria-1-3', label: '1-3 Secundaria' },
];

const TRACKING_BUTTONS = [
  { subject: TypeSubject.sessionTracking, label: 'Seguimiento', Icon: CalendarDays, callbackKey: 'onSessionTracking' as const },
  { subject: TypeSubject.weeklyPlanning, label: 'Plan Semanal', Icon: ListChecks, callbackKey: 'onWeeklyPlanning' as const },
  { subject: TypeSubject.evaluationPlanning, label: 'Plan Evaluación', Icon: BookOpen, callbackKey: 'onEvaluationPlanning' as const },
  { subject: TypeSubject.reportByStudent, label: 'Informe', Icon: BarChart2, callbackKey: 'onReport' as const },
];

export const CorrespondenceTable = (props: Props) => {
  const { limitInit = 10, dataCorrespondence, onRefresh, onView, onEvaluate, onSessionTracking, onWeeklyPlanning, onEvaluationPlanning, onReport } = props;

  const { hasPermission } = usePermissionStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataCorrespondence.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
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
          placeholder="Buscar evaluaciones..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead>Estudiante</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataCorrespondence.data.map((item) => {
            const childInfo = item.document?.childInfo ?? [];
            const nombre = childInfo.find((q) => q.question === 'Nombre')?.answer
              ?? childInfo.find((q) => q.question === 'Nombre del niño')?.answer?.toString().split(' ')[0];
            const apellido = childInfo.find((q) => q.question === 'Apellido')?.answer;
            const childName = nombre ? `${nombre}${apellido ? ' ' + apellido : ''}` : undefined;
            const tutorNombre = childInfo.find((q) => q.question === 'Nombre del Tutor')?.answer;
            const tutorApellido = childInfo.find((q) => q.question === 'Apellido del Tutor')?.answer;
            const tutorName = tutorNombre ? `${tutorNombre}${tutorApellido ? ' ' + tutorApellido : ''}` : undefined;

            return (
              <TableRow key={item.id}>
                {/* Columna estudiante */}
                <TableCell>
                  {childName ? (
                    <div>
                      <p className="font-medium text-sm">{String(childName)}</p>
                      {tutorName && (
                        <p className="text-xs text-gray-500">Tutor: {String(tutorName)}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">Sin datos</span>
                  )}
                </TableCell>

                {/* Tipo de documento */}
                <TableCell className="text-sm text-gray-600">
                  {item.document.type}
                </TableCell>

                {/* Acciones */}
                <TableCell>
                  <div className="flex flex-wrap gap-2 items-center">

                    {/* Ver evaluación recibida */}
                    {hasPermission(TypeAction.read, TypeSubject.correspondence) && (
                      <button
                        onClick={() => onView(item)}
                        title="Ver evaluación"
                        className="p-1 rounded hover:bg-gray-100 transition"
                      >
                        <Eye className="w-5 h-5 text-blue-500" />
                      </button>
                    )}

                    {/* Botones de protocolo de evaluación (Evaluador) */}
                    {EVAL_BUTTONS.map(({ subject, catalogId, label }) =>
                      hasPermission(TypeAction.create, subject) ? (
                        <button
                          key={catalogId}
                          onClick={() => onEvaluate?.(item, catalogId)}
                          title={label}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      ) : null
                    )}

                    {/* Botones de seguimiento (Profesor) */}
                    {TRACKING_BUTTONS.map(({ subject, label, Icon, callbackKey }) => {
                      const callbacks = { onSessionTracking, onWeeklyPlanning, onEvaluationPlanning, onReport };
                      const cb = callbacks[callbackKey];
                      return hasPermission(TypeAction.create, subject) && cb ? (
                        <button
                          key={label}
                          onClick={() => cb(item)}
                          title={label}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      ) : null;
                    })}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

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

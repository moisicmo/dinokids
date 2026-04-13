import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePermissionStore, useReportStore } from "@/hooks";
import { usePrintStore } from "@/hooks/usePrint";
import { useState } from "react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TypeAction, TypeSubject } from "@/models";
import { Download, Search } from "lucide-react";

const statusLabel: Record<string, { label: string; color: string }> = {
  present:  { label: 'Presente',  color: 'bg-secondary-100 text-secondary border-secondary/20' },
  absent:   { label: 'Ausente',   color: 'bg-red-50 text-red-600 border-red-200' },
  late:     { label: 'Tardanza',  color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  excused:  { label: 'Justificado', color: 'bg-blue-50 text-blue-600 border-blue-200' },
};

const ReportAttendance = () => {
  const { getReportAttendance } = useReportStore();
  const { handleXlsx } = usePrintStore();
  const { hasPermission } = usePermissionStore();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [xlsxBase64, setXlsxBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    if (!startDate || !endDate) {
      alert("Seleccione un rango de fechas válido.");
      return;
    }
    setLoading(true);
    try {
      const result = await getReportAttendance(startDate, endDate);
      setPreviewData(result.data);
      setXlsxBase64(result.xlsxBase64);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!xlsxBase64) return;
    handleXlsx(xlsxBase64);
  };

  const canGenerate = hasPermission(TypeAction.read, TypeSubject.report);

  // Totales por estado
  const totals = previewData
    ? {
        present: previewData.filter(r => r.status === 'present').length,
        absent:  previewData.filter(r => r.status === 'absent').length,
        late:    previewData.filter(r => r.status === 'late').length,
        excused: previewData.filter(r => r.status === 'excused').length,
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Reporte de Asistencias</h2>
        <p className="text-sm text-gray-500 mt-0.5">Consulta el registro de asistencia por rango de fechas</p>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPreviewData(null); }}
                className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPreviewData(null); }}
                className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
              />
            </div>
            {canGenerate && (
              <Button
                onClick={handlePreview}
                disabled={loading || !startDate || !endDate}
                className="flex items-center gap-2 text-white"
                style={{ backgroundColor: '#B0008E' }}
              >
                <Search className="w-4 h-4" />
                {loading ? "Cargando..." : "Vista previa"}
              </Button>
            )}
            {xlsxBase64 && (
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
                style={{ borderColor: '#6BA539', color: '#6BA539' }}
              >
                <Download className="w-4 h-4" />
                Descargar XLSX
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de totales */}
      {totals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'present', label: 'Presentes',    color: '#6BA539', bg: '#eef6e5' },
            { key: 'absent',  label: 'Ausentes',     color: '#F04438', bg: '#fee2e2' },
            { key: 'late',    label: 'Tardanzas',    color: '#FBBF24', bg: '#fef9c3' },
            { key: 'excused', label: 'Justificados', color: '#6b7280', bg: '#f3f4f6' },
          ].map(({ key, label, color, bg }) => (
            <Card key={key} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>
                  {totals[key as keyof typeof totals]}
                </p>
              </CardContent>
              <div className="h-1" style={{ backgroundColor: color }} />
            </Card>
          ))}
        </div>
      )}

      {/* Tabla de resultados */}
      {previewData !== null && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <h3 className="text-base font-semibold text-gray-800">
              Vista Previa
              <span className="ml-2 text-sm font-normal text-gray-400">
                {previewData.length} registro{previewData.length !== 1 ? 's' : ''}
              </span>
            </h3>

            <div className="rounded-lg overflow-hidden border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cód.</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estudiante</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aula</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Observación</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400 py-10">
                        No hay registros de asistencia en el rango seleccionado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    previewData.map((record, i) => {
                      const status = statusLabel[record.status] ?? { label: record.status, color: 'bg-gray-100 text-gray-600' };
                      return (
                        <TableRow key={record.id ?? i} className="hover:bg-gray-50/50">
                          <TableCell className="text-sm text-gray-500">{record.student?.code ?? '—'}</TableCell>
                          <TableCell className="text-sm font-medium text-gray-800">
                            {`${record.student?.user?.name ?? ''} ${record.student?.user?.lastName ?? ''}`.trim() || '—'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{record.room?.name ?? '—'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[11px] ${status.color}`}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">{record.observation ?? '—'}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {record.date ? format(new Date(record.date), 'dd/MM/yyyy', { locale: es }) : '—'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportAttendance;

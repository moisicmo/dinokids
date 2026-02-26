import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { usePermissionStore, useReportStore } from "@/hooks";
import { usePrintStore } from "@/hooks/usePrint";
import { useState } from "react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TypeAction, TypeSubject } from "@/models";
import { Download, Search } from "lucide-react";

const ReportDebt = () => {
  const { getReportDebts } = useReportStore();
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
      const result = await getReportDebts(startDate, endDate);
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

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Reporte de Deudas</h2>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPreviewData(null); }}
                className="border rounded px-2 py-1.5 w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPreviewData(null); }}
                className="border rounded px-2 py-1.5 w-full text-sm"
              />
            </div>
            {canGenerate && (
              <Button
                onClick={handlePreview}
                disabled={loading || !startDate || !endDate}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? "Cargando..." : "Vista previa"}
              </Button>
            )}
            {xlsxBase64 && (
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4" />
                Descargar XLSX
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {previewData !== null && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-base font-semibold">
              Vista Previa
              <span className="ml-2 text-sm font-normal text-gray-400">
                {previewData.length} registro{previewData.length !== 1 ? 's' : ''}
              </span>
            </h3>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cód. Estudiante</TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Monto total</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Fecha vencimiento</TableHead>
                  <TableHead>Fecha creación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                      No hay deudas en el rango seleccionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  previewData.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell>{debt.inscription?.student?.code ?? '—'}</TableCell>
                      <TableCell>{`${debt.inscription?.student?.user?.name ?? ''} ${debt.inscription?.student?.user?.lastName ?? ''}`}</TableCell>
                      <TableCell>{debt.totalAmount}</TableCell>
                      <TableCell>{debt.remainingBalance}</TableCell>
                      <TableCell>{debt.dueDate ? format(new Date(debt.dueDate), 'dd/MM/yyyy', { locale: es }) : '—'}</TableCell>
                      <TableCell>{format(new Date(debt.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportDebt;
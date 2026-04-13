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
import { Download, Search, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const ReportFinancial = () => {
  const { getReportFinancial } = useReportStore();
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
      const result = await getReportFinancial(startDate, endDate);
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

  // Métricas financieras
  const summary = previewData
    ? {
        totalPagado: previewData.reduce((sum, r) => sum + (r.amount ?? 0), 0),
        totalDeuda:  previewData.reduce((sum, r) => sum + (r.debt?.remainingBalance ?? 0), 0),
        cantidad:    previewData.length,
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Reporte Financiero</h2>
        <p className="text-sm text-gray-500 mt-0.5">Registro de pagos realizados por rango de fechas</p>
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

      {/* Resumen financiero */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#eef6e5' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#6BA539' }} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Cobrado</p>
                <p className="text-xl font-bold" style={{ color: '#6BA539' }}>
                  Bs {summary.totalPagado.toFixed(2)}
                </p>
              </div>
            </CardContent>
            <div className="h-1" style={{ backgroundColor: '#6BA539' }} />
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-50">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Saldo Pendiente</p>
                <p className="text-xl font-bold text-red-500">
                  Bs {summary.totalDeuda.toFixed(2)}
                </p>
              </div>
            </CardContent>
            <div className="h-1 bg-red-400" />
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fce3f4' }}>
                <DollarSign className="w-5 h-5" style={{ color: '#B0008E' }} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">N° Transacciones</p>
                <p className="text-xl font-bold" style={{ color: '#B0008E' }}>
                  {summary.cantidad}
                </p>
              </div>
            </CardContent>
            <div className="h-1" style={{ backgroundColor: '#B0008E' }} />
          </Card>
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
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estudiante</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Monto Pagado (Bs)</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Saldo Restante (Bs)</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Método</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Referencia</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400 py-10">
                        No hay pagos en el rango seleccionado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    previewData.map((payment, i) => (
                      <TableRow key={payment.id ?? i} className="hover:bg-gray-50/50">
                        <TableCell className="text-sm font-medium text-gray-800">
                          {`${payment.debt?.inscription?.student?.user?.name ?? ''} ${payment.debt?.inscription?.student?.user?.lastName ?? ''}`.trim()
                            || payment.debt?.inscription?.booking?.name
                            || '—'}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-semibold" style={{ color: '#6BA539' }}>
                            {Number(payment.amount ?? 0).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-semibold ${(payment.debt?.remainingBalance ?? 0) > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {Number(payment.debt?.remainingBalance ?? 0).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {payment.payMethod ? (
                            <Badge variant="outline" className="text-[11px] bg-gray-50 text-gray-600 border-gray-200">
                              {payment.payMethod}
                            </Badge>
                          ) : '—'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{payment.reference ?? '—'}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {payment.createdAt
                            ? format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))
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

export default ReportFinancial;

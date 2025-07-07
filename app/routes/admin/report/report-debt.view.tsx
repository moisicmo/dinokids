
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useDebtStore, useInscriptionStore, useReportStore } from "@/hooks";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Reportdebt = () => {

  const { getReportDebts } = useReportStore();
  const { dataDebt, getDebts } = useDebtStore();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert("Seleccione un rango de fechas válido.");
      return;
    }

    try {
      getReportDebts();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al generar el reporte.");
    }
  };

  useEffect(() => {
    getDebts();
  }, [startDate,endDate])
  

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Reporte de deudas </h2>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Fecha Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Fecha Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={handleGenerateReport}>
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Vista Previa</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cód. Estudiante</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Monto total</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataDebt.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No hay datos
                  </TableCell>
                </TableRow>
              ) : (
                dataDebt.data.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell>{debt.inscription.student?.code}</TableCell>
                    <TableCell>{`${debt.inscription.student?.user.name} ${debt.inscription.student?.user.lastName}`}</TableCell>
                    <TableCell>{debt.totalAmount}</TableCell>
                    <TableCell>{debt.remainingBalance}</TableCell>
                    <TableCell>{debt.dueDate?format(new Date(debt.dueDate), 'dd-MMMM-yyyy HH:mm', { locale: es }):'-'}</TableCell>
                    <TableCell>{format(new Date(debt.createdAt), 'dd-MMMM-yyyy HH:mm', { locale: es })}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reportdebt;
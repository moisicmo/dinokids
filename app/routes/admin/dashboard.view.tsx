import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { useEffect, useState } from "react";
import { useDashboardStore, useAuthStore } from "@/hooks";
import { initDashboardModel } from "@/models/response/dashboard.response";
import type { DashboardModel } from "@/models";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dashboard = () => {

  const { getData, getAllBranchesData } = useDashboardStore();
  const { branchSelect } = useAuthStore();
  const [data, setData] = useState<DashboardModel>(initDashboardModel);
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchData = async () => {
      let res;
      if (!branchSelect) {
        res = await getAllBranchesData();
        setShowAllBranches(true);
      } else {
        res = await getData();
        setShowAllBranches(false);
      }
      setData(res);
    };
    fetchData();
  }, [branchSelect]);

  // Calcular métricas globales consolidadas
  const globalMetrics = showAllBranches && data.allBranchesData && data.allBranchesData.length > 0
    ? {
      totalStudents: data.allBranchesData.reduce((sum, b) => sum + b.metrics.totalStudents, 0),
      totalTeachers: data.allBranchesData.reduce((sum, b) => sum + b.metrics.totalTeachers, 0),
      totalDebts: data.allBranchesData.reduce((sum, b) => sum + b.metrics.totalDebts, 0),
      totalPayments: data.allBranchesData.reduce((sum, b) => sum + b.metrics.totalPayments, 0),
      totalBranches: data.allBranchesData.length,
    }
    : data.metrics;

  // Calcular inscripciones globales
  const globalInscriptionsData = showAllBranches && data.allBranchesData && data.allBranchesData.length > 0
    ? data.allBranchesData.reduce((acc, branchData) => {
      branchData.inscriptionsData.forEach((item, index) => {
        if (!acc[index]) {
          acc[index] = { month: item.month, count: 0 };
        }
        acc[index].count += item.count;
      });
      return acc;
    }, [] as { month: string; count: number }[])
    : data.inscriptionsData;

  // Calcular deudas globales
  const globalDebts = showAllBranches && data.allBranchesData && data.allBranchesData.length > 0
    ? data.allBranchesData.flatMap(b => b.debts)
    : data.debts;

  // Preparar datos para gráfico comparativo
  const comparativeData = data.allBranchesData && data.allBranchesData.length > 0
    ? data.allBranchesData.map(branchData => ({
      name: branchData.branch.name.length > 15 ? branchData.branch.name.substring(0, 15) + '...' : branchData.branch.name,
      students: branchData.metrics.totalStudents,
      teachers: branchData.metrics.totalTeachers,
      debts: branchData.metrics.totalDebts,
      payments: branchData.metrics.totalPayments,
    }))
    : [];

  // Preparar datos para tabla comparativa
  const comparativeTableData = data.allBranchesData && data.allBranchesData.length > 0
    ? data.allBranchesData.map(branchData => ({
      branch: branchData.branch,
      metrics: branchData.metrics,
      debtsCount: branchData.debts.length,
      totalDebtAmount: branchData.debts.reduce((sum, d) => sum + d.remainingBalance, 0),
    }))
    : [];

  const renderMetrics = (metrics: typeof globalMetrics, title?: string) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-500 mb-1">{title || 'Estudiantes'}</h2>
          <p className="text-3xl font-bold">{metrics?.totalStudents ?? "..."}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-500 mb-1">{title || 'Profesores'}</h2>
          <p className="text-3xl font-bold">{metrics?.totalTeachers ?? "..."}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-500 mb-1">{title || 'Deudas Pendientes'}</h2>
          <p className="text-3xl font-bold">{metrics?.totalDebts ?? "..."}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm text-gray-500 mb-1">{title || 'Pagos'}</h2>
          <p className="text-3xl font-bold">{metrics?.totalPayments ?? "..."}</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderInscriptionsChart = (inscriptionsData: typeof globalInscriptionsData, title?: string) => (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">{title || 'Inscripciones por Mes'}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inscriptionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#ac1380" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderDebtsTable = (debts: DashboardModel['debts'], title?: string) => (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">{title || 'Deudas Pendientes'}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cod. Estudiante</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>Monto Total (Bs)</TableHead>
              <TableHead>Saldo (Bs)</TableHead>
              <TableHead>Vencimiento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debts.map(debt => (
              <TableRow key={debt.id}>
                <TableCell>{debt.inscription.student?.code ?? debt.inscription.booking?.dni}</TableCell>
                <TableCell>
                  {`${debt.inscription.student?.user.name ?? ''} ${debt.inscription.student?.user.lastName ?? ''}`.trim()
                    || debt.inscription.booking?.name
                    || '-'}
                </TableCell>
                <TableCell>{debt.totalAmount}</TableCell>
                <TableCell>{debt.remainingBalance}</TableCell>
                <TableCell>
                  {debt.dueDate ? format(new Date(debt.dueDate), 'dd-MMMM-yyyy', { locale: es }) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Vista de un solo branch
  if (!showAllBranches) {
    return (
      <div className="p-6 space-y-6">
        {renderMetrics(data.metrics)}
        {renderInscriptionsChart(data.inscriptionsData)}
        {data.debts.length > 0 && renderDebtsTable(data.debts)}
      </div>
    );
  }

  // Vista de todos los branches
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard - Todos los Branches</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">Vista General</TabsTrigger>
            <TabsTrigger value="comparativa">Vista Comparativa</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="general" className="space-y-6">
          {/* Métricas Globales */}
          {renderMetrics(globalMetrics)}

          {/* Gráfico de Inscripciones Globales */}
          {renderInscriptionsChart(globalInscriptionsData, "Inscripciones Globales por Mes")}

          {/* Tabla de Deudas Globales */}
          {globalDebts.length > 0 && renderDebtsTable(globalDebts, "Todas las Deudas Pendientes")}
        </TabsContent>

        <TabsContent value="comparativa" className="space-y-6">
          {/* Gráfico Comparativo de Métricas */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Comparativa de Métricas por Branch</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={comparativeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#4ade80" name="Estudiantes" />
                  <Bar dataKey="teachers" fill="#60a5fa" name="Profesores" />
                  <Bar dataKey="debts" fill="#f87171" name="Deudas" />
                  <Bar dataKey="payments" fill="#fbbf24" name="Pagos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabla Comparativa */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Tabla Comparativa por Branch</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Estudiantes</TableHead>
                    <TableHead className="text-right">Profesores</TableHead>
                    <TableHead className="text-right">Deudas (cant)</TableHead>
                    <TableHead className="text-right">Deudas (monto)</TableHead>
                    <TableHead className="text-right">Pagos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparativeTableData.map((row) => (
                    <TableRow key={row.branch.id}>
                      <TableCell className="font-medium">{row.branch.name}</TableCell>
                      <TableCell className="text-right">{row.metrics.totalStudents}</TableCell>
                      <TableCell className="text-right">{row.metrics.totalTeachers}</TableCell>
                      <TableCell className="text-right">{row.debtsCount}</TableCell>
                      <TableCell className="text-right">{row.totalDebtAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{row.metrics.totalPayments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Gráfico de Línea - Tendencia de Inscripciones por Branch */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Tendencia de Inscripciones por Branch</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data.allBranchesData?.[0]?.inscriptionsData.map((item, i) => ({
                  month: item.month,
                  ...Object.fromEntries(data.allBranchesData!.map(b => [b.branch.id, b.inscriptionsData[i]?.count || 0]))
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  {data.allBranchesData?.map((branchData, index) => (
                    <Line
                      key={branchData.branch.id}
                      type="monotone"
                      dataKey={branchData.branch.id}
                      stroke={['#ac1380', '#4ade80', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa', '#f472b6'][index % 7]}
                      name={branchData.branch.name}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default dashboard;

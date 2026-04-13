import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { useDashboardStore, useAuthStore } from "@/hooks";
import { initDashboardModel } from "@/models/response/dashboard.response";
import type { DashboardModel } from "@/models";
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap, BookOpen, AlertTriangle, CreditCard, Building2,
  TrendingUp, TrendingDown, Minus, Users, Clock, CheckCircle2,
  AlertCircle, Percent,
} from "lucide-react";

/* ─────────────────── helpers ─────────────────── */

const today = new Date();

function getDebtStatus(dueDate?: Date): 'overdue' | 'soon' | 'current' {
  if (!dueDate) return 'current';
  const d = new Date(dueDate);
  if (d < today) return 'overdue';
  if (differenceInDays(d, today) <= 7) return 'soon';
  return 'current';
}

const statusConfig = {
  overdue: { label: 'Vencida',   className: 'bg-red-50 text-red-600 border-red-200' },
  soon:    { label: 'Por vencer', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  current: { label: 'Vigente',   className: 'bg-green-50 text-green-700 border-green-200' },
};

function studentName(debt: DashboardModel['debts'][0]): string {
  const s = debt.inscription.student;
  const b = debt.inscription.booking;
  return `${s?.user?.name ?? ''} ${s?.user?.lastName ?? ''}`.trim() || b?.name || '—';
}

function studentCode(debt: DashboardModel['debts'][0]): string {
  return debt.inscription.student?.code ?? debt.inscription.booking?.dni ?? '—';
}

/* ─────────────────── MetricCard ─────────────────── */

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  sub?: React.ReactNode;
}

function MetricCard({ label, value, icon, color, bgColor, sub }: MetricCardProps) {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
            <span style={{ color }}>{icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 mb-0.5 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value ?? <span className="text-gray-300 text-lg">—</span>}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          </div>
        </div>
        <div className="h-1 w-full" style={{ backgroundColor: color }} />
      </CardContent>
    </Card>
  );
}

/* ─────────────────── TrendChip ─────────────────── */

function TrendChip({ pct }: { pct: number }) {
  if (Math.abs(pct) < 1) return (
    <span className="inline-flex items-center gap-0.5 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
      <Minus className="w-3 h-3" /> Sin cambio
    </span>
  );
  if (pct > 0) return (
    <span className="inline-flex items-center gap-0.5 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
      <TrendingUp className="w-3 h-3" /> +{pct.toFixed(0)}% vs mes anterior
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
      <TrendingDown className="w-3 h-3" /> {pct.toFixed(0)}% vs mes anterior
    </span>
  );
}

/* ─────────────────── AlertBanner ─────────────────── */

function AlertBanners({ debts }: { debts: DashboardModel['debts'] }) {
  const overdue = debts.filter(d => getDebtStatus(d.dueDate) === 'overdue');
  const soon    = debts.filter(d => getDebtStatus(d.dueDate) === 'soon');
  const overdueAmount = overdue.reduce((s, d) => s + d.remainingBalance, 0);

  if (overdue.length === 0 && soon.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {overdue.length > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {overdue.length} deuda{overdue.length > 1 ? 's' : ''} vencida{overdue.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              Bs {overdueAmount.toFixed(2)} pendientes de cobro urgente
            </p>
          </div>
        </div>
      )}
      {soon.length > 0 && (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-700">
              {soon.length} deuda{soon.length > 1 ? 's' : ''} por vencer esta semana
            </p>
            <p className="text-xs text-yellow-600 mt-0.5">Contactar a los responsables antes del vencimiento</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── CollectionPie ─────────────────── */

function CollectionPie({ debts }: { debts: DashboardModel['debts'] }) {
  const totalOriginal  = debts.reduce((s, d) => s + d.totalAmount, 0);
  const totalPending   = debts.reduce((s, d) => s + d.remainingBalance, 0);
  const totalCollected = totalOriginal - totalPending;
  const rate = totalOriginal > 0 ? (totalCollected / totalOriginal) * 100 : 0;

  const pieData = [
    { name: 'Cobrado',   value: totalCollected },
    { name: 'Pendiente', value: totalPending },
  ];

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardContent className="p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-1">Estado de Cobranza</h2>
        <p className="text-xs text-gray-400 mb-4">Del total de deudas registradas</p>

        {totalOriginal === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
            <p className="text-sm">Sin deudas registradas</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <PieChart width={200} height={200}>
                <Pie data={pieData} cx={95} cy={95} innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={2}>
                  <Cell fill="#6BA539" />
                  <Cell fill="#F04438" />
                </Pie>
                <Tooltip
                  formatter={(v: number) => [`Bs ${v.toFixed(2)}`, '']}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                />
              </PieChart>
            </div>

            {/* Rate badge in centre is faked via overlay — use stat rows instead */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Cobrado</p>
                <p className="text-lg font-bold text-green-600">Bs {totalCollected.toFixed(0)}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Pendiente</p>
                <p className="text-lg font-bold text-red-600">Bs {totalPending.toFixed(0)}</p>
              </div>
            </div>

            {/* Collection rate bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Tasa de cobro</span>
                <span className="font-semibold text-gray-700">{rate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(rate, 100)}%`,
                    backgroundColor: rate >= 75 ? '#6BA539' : rate >= 50 ? '#FBBF24' : '#F04438',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* ─────────────────── InscriptionsChart ─────────────────── */

function InscriptionsChart({
  inscriptionsData,
  title = 'Inscripciones por Mes',
}: {
  inscriptionsData: { month: string; count: number }[];
  title?: string;
}) {
  const last  = inscriptionsData[inscriptionsData.length - 1]?.count ?? 0;
  const prev  = inscriptionsData[inscriptionsData.length - 2]?.count ?? 0;
  const trend = prev > 0 ? ((last - prev) / prev) * 100 : 0;
  const total = inscriptionsData.reduce((s, i) => s + i.count, 0);

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{total} inscripciones en el período</p>
          </div>
          <TrendChip pct={trend} />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={inscriptionsData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar dataKey="count" fill="#B0008E" radius={[4, 4, 0, 0]} name="Inscripciones" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/* ─────────────────── DebtTable ─────────────────── */

function DebtTable({ debts, title }: { debts: DashboardModel['debts']; title?: string }) {
  const sorted = [...debts].sort((a, b) => {
    const order = { overdue: 0, soon: 1, current: 2 };
    const sa = getDebtStatus(a.dueDate);
    const sb = getDebtStatus(b.dueDate);
    if (order[sa] !== order[sb]) return order[sa] - order[sb];
    return b.remainingBalance - a.remainingBalance;
  });

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-gray-800">{title ?? 'Deudas Pendientes'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ordenadas por urgencia</p>
          </div>
          <div className="flex gap-2 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>Vencida</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"/>Por vencer</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>Vigente</span>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border border-gray-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cód.</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estudiante</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Total (Bs)</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Saldo (Bs)</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">% Cobrado</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vencimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-10">
                    <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    No hay deudas pendientes
                  </TableCell>
                </TableRow>
              )}
              {sorted.map((debt) => {
                const status = getDebtStatus(debt.dueDate);
                const cfg    = statusConfig[status];
                const daysOverdue = debt.dueDate && status === 'overdue'
                  ? differenceInDays(today, new Date(debt.dueDate))
                  : null;
                const collected = debt.totalAmount > 0
                  ? ((debt.totalAmount - debt.remainingBalance) / debt.totalAmount) * 100
                  : 0;

                return (
                  <TableRow key={debt.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Badge variant="outline" className={`text-[10px] w-fit ${cfg.className}`}>
                          {cfg.label}
                        </Badge>
                        {daysOverdue !== null && (
                          <span className="text-[10px] text-red-400">{daysOverdue}d atrás</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{studentCode(debt)}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-800">{studentName(debt)}</TableCell>
                    <TableCell className="text-right text-sm text-gray-600">{Number(debt.totalAmount).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-semibold text-red-600">{Number(debt.remainingBalance).toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(collected, 100)}%`,
                              backgroundColor: collected >= 75 ? '#6BA539' : collected >= 40 ? '#FBBF24' : '#F04438',
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{collected.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {debt.dueDate ? format(new Date(debt.dueDate), 'dd MMM yyyy', { locale: es }) : '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─────────────────── Main dashboard ─────────────────── */

const dashboard = () => {
  const { getData, getAllBranchesData } = useDashboardStore();
  const { branchSelect } = useAuthStore();
  const [data, setData] = useState<DashboardModel>(initDashboardModel);
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchData = async () => {
      if (!branchSelect) {
        const res = await getAllBranchesData();
        setShowAllBranches(true);
        setData(res);
      } else {
        const res = await getData();
        setShowAllBranches(false);
        setData(res);
      }
    };
    fetchData();
  }, [branchSelect]);

  /* ── Global aggregates (all branches) ── */
  const globalMetrics = showAllBranches && data.allBranchesData?.length
    ? {
        totalStudents: data.allBranchesData.reduce((s, b) => s + b.metrics.totalStudents, 0),
        totalTeachers: data.allBranchesData.reduce((s, b) => s + b.metrics.totalTeachers, 0),
        totalDebts:    data.allBranchesData.reduce((s, b) => s + b.metrics.totalDebts, 0),
        totalPayments: data.allBranchesData.reduce((s, b) => s + b.metrics.totalPayments, 0),
        totalBranches: data.allBranchesData.length,
      }
    : data.metrics;

  const globalInscriptions = showAllBranches && data.allBranchesData?.length
    ? data.allBranchesData.reduce((acc, bd) => {
        bd.inscriptionsData.forEach((item, i) => {
          if (!acc[i]) acc[i] = { month: item.month, count: 0 };
          acc[i].count += item.count;
        });
        return acc;
      }, [] as { month: string; count: number }[])
    : data.inscriptionsData;

  const globalDebts = showAllBranches && data.allBranchesData?.length
    ? data.allBranchesData.flatMap(b => b.debts)
    : data.debts;

  /* ── Single-branch KPIs ── */
  const m = data.metrics;
  const ratio = m.totalTeachers > 0 ? (m.totalStudents / m.totalTeachers).toFixed(1) : '—';
  const totalPending   = globalDebts.reduce((s, d) => s + d.remainingBalance, 0);
  const totalOriginal  = globalDebts.reduce((s, d) => s + d.totalAmount, 0);
  const totalCollected = totalOriginal - totalPending;
  const collectionRate = totalOriginal > 0 ? (totalCollected / totalOriginal * 100) : 0;

  /* ── Render KPI cards ── */
  const renderKPIs = (metrics: typeof globalMetrics, debts: DashboardModel['debts']) => {
    const pending  = debts.reduce((s, d) => s + d.remainingBalance, 0);
    const original = debts.reduce((s, d) => s + d.totalAmount, 0);
    const rate     = original > 0 ? (original - pending) / original * 100 : 0;
    const r = (metrics as any).totalTeachers > 0
      ? ((metrics as any).totalStudents / (metrics as any).totalTeachers).toFixed(1)
      : '—';

    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Estudiantes"
          value={metrics?.totalStudents}
          icon={<GraduationCap className="w-5 h-5" />}
          color="#6BA539" bgColor="#eef6e5"
          sub={`Ratio ${r} alumnos/prof.`}
        />
        <MetricCard
          label="Profesores"
          value={metrics?.totalTeachers}
          icon={<BookOpen className="w-5 h-5" />}
          color="#B0008E" bgColor="#fce3f4"
        />
        <MetricCard
          label="Deudas Pendientes"
          value={metrics?.totalDebts}
          icon={<AlertCircle className="w-5 h-5" />}
          color="#F04438" bgColor="#fee2e2"
          sub={`${debts.filter(d => getDebtStatus(d.dueDate) === 'overdue').length} vencidas`}
        />
        <MetricCard
          label="Por Cobrar"
          value={`Bs ${pending.toFixed(0)}`}
          icon={<CreditCard className="w-5 h-5" />}
          color="#F04438" bgColor="#fee2e2"
        />
        <MetricCard
          label="Tasa de Cobro"
          value={`${rate.toFixed(1)}%`}
          icon={<Percent className="w-5 h-5" />}
          color={rate >= 75 ? '#6BA539' : rate >= 50 ? '#FBBF24' : '#F04438'}
          bgColor={rate >= 75 ? '#eef6e5' : rate >= 50 ? '#fef9c3' : '#fee2e2'}
          sub={`Bs ${(original - pending).toFixed(0)} cobrado de Bs ${original.toFixed(0)}`}
        />
      </div>
    );
  };

  /* ── Comparative chart data ── */
  const comparativeData = data.allBranchesData?.length
    ? data.allBranchesData.map(bd => ({
        name: bd.branch.name.length > 14 ? bd.branch.name.slice(0, 14) + '…' : bd.branch.name,
        students: bd.metrics.totalStudents,
        teachers: bd.metrics.totalTeachers,
        deudas: bd.debts.reduce((s, d) => s + d.remainingBalance, 0),
      }))
    : [];

  const comparativeTableData = data.allBranchesData?.length
    ? data.allBranchesData.map(bd => ({
        branch:      bd.branch,
        metrics:     bd.metrics,
        overdueCount: bd.debts.filter(d => getDebtStatus(d.dueDate) === 'overdue').length,
        totalDebt:   bd.debts.reduce((s, d) => s + d.remainingBalance, 0),
        totalOrig:   bd.debts.reduce((s, d) => s + d.totalAmount, 0),
        rate:        bd.debts.reduce((s, d) => s + d.totalAmount, 0) > 0
                       ? (bd.debts.reduce((s, d) => s + (d.totalAmount - d.remainingBalance), 0) /
                          bd.debts.reduce((s, d) => s + d.totalAmount, 0)) * 100
                       : 100,
      }))
    : [];

  /* ── Single branch ── */
  if (!showAllBranches) {
    return (
      <div className="space-y-5">
        {/* KPIs */}
        {renderKPIs(data.metrics, data.debts)}

        {/* Alerts */}
        <AlertBanners debts={data.debts} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InscriptionsChart inscriptionsData={data.inscriptionsData} />
          <CollectionPie debts={data.debts} />
        </div>

        {/* Debts table */}
        {data.debts.length > 0 && <DebtTable debts={data.debts} />}
      </div>
    );
  }

  /* ── All branches ── */
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Global</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vista consolidada de todas las sucursales</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
          <Building2 className="w-4 h-4" style={{ color: '#6BA539' }} />
          <span className="text-sm font-semibold text-gray-700">
            {(globalMetrics as any)?.totalBranches ?? 0} sucursales
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-gray-100 shadow-sm p-1 rounded-lg">
          <TabsTrigger value="general"     className="text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">Vista General</TabsTrigger>
          <TabsTrigger value="comparativa" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">Comparativa</TabsTrigger>
        </TabsList>

        {/* ── General tab ── */}
        <TabsContent value="general" className="space-y-5 mt-4">
          {renderKPIs(globalMetrics, globalDebts)}
          <AlertBanners debts={globalDebts} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InscriptionsChart inscriptionsData={globalInscriptions} title="Inscripciones Globales por Mes" />
            <CollectionPie debts={globalDebts} />
          </div>
          {globalDebts.length > 0 && <DebtTable debts={globalDebts} title="Todas las Deudas Pendientes" />}
        </TabsContent>

        {/* ── Comparative tab ── */}
        <TabsContent value="comparativa" className="space-y-5 mt-4">

          {/* Bar chart: students + teachers per branch */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-1">Capacidad por Sucursal</h2>
              <p className="text-xs text-gray-400 mb-4">Estudiantes, profesores y saldo pendiente (Bs)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparativeData} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="students" fill="#6BA539" name="Estudiantes" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="teachers" fill="#B0008E" name="Profesores"  radius={[3, 3, 0, 0]} />
                  <Bar dataKey="deudas"   fill="#F04438" name="Saldo pendiente (Bs)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparative table with collection rate */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <h2 className="text-base font-semibold text-gray-800">Resumen Financiero por Sucursal</h2>
              <div className="rounded-lg overflow-hidden border border-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sucursal</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Alumnos</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Profesores</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Ratio</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Deudas vencidas</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Saldo (Bs)</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tasa cobro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparativeTableData.map((row) => (
                      <TableRow key={row.branch.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium text-gray-800 text-sm">{row.branch.name}</TableCell>
                        <TableCell className="text-right text-sm font-semibold" style={{ color: '#6BA539' }}>{row.metrics.totalStudents}</TableCell>
                        <TableCell className="text-right text-sm font-semibold" style={{ color: '#B0008E' }}>{row.metrics.totalTeachers}</TableCell>
                        <TableCell className="text-right text-sm text-gray-500">
                          {row.metrics.totalTeachers > 0
                            ? (row.metrics.totalStudents / row.metrics.totalTeachers).toFixed(1)
                            : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.overdueCount > 0
                            ? <span className="text-sm font-semibold text-red-600">{row.overdueCount}</span>
                            : <span className="text-sm text-gray-400">0</span>}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-red-600">
                          {row.totalDebt.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.min(row.rate, 100)}%`,
                                  backgroundColor: row.rate >= 75 ? '#6BA539' : row.rate >= 50 ? '#FBBF24' : '#F04438',
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-10 text-right">{row.rate.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Inscription trends line chart */}
          {(data.allBranchesData?.length ?? 0) > 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-gray-800 mb-1">Tendencia de Inscripciones por Sucursal</h2>
                <p className="text-xs text-gray-400 mb-4">Comparación mensual entre sucursales</p>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={data.allBranchesData![0].inscriptionsData.map((item, i) => ({
                      month: item.month,
                      ...Object.fromEntries(
                        data.allBranchesData!.map(b => [b.branch.name, b.inscriptionsData[i]?.count ?? 0])
                      ),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {data.allBranchesData!.map((bd, i) => (
                      <Line
                        key={bd.branch.id}
                        type="monotone"
                        dataKey={bd.branch.name}
                        stroke={['#B0008E', '#6BA539', '#FBBF24', '#F04438', '#a78bfa', '#f472b6', '#60a5fa'][i % 7]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default dashboard;

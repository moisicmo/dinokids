import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import type { CashBoxSessionDetailModel } from '@/models';
import { useEnums } from '@/hooks';
import { Badge } from '@/components/ui/badge';

const fmt = (date: string) => format(new Date(date), 'dd-MMM-yyyy HH:mm', { locale: es });

export const CashBoxSessionDetail = ({ detail }: { detail: CashBoxSessionDetailModel }) => {
  const { getTypeDebt } = useEnums();
  const totalSales = detail.totalSales.cash + detail.totalSales.bank + detail.totalSales.qr;
  const totalExtraIncome = detail.extraIncome.cash + detail.extraIncome.bank + detail.extraIncome.qr;
  const totalExpenses = detail.expenses.cash + detail.expenses.bank + detail.expenses.qr;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="bg-muted/40 rounded-lg px-4 py-3">
          <p className="text-xs text-muted-foreground mb-0.5">Apertura</p>
          <p className="font-medium">{fmt(detail.openedAt)}</p>
        </div>
        <div className="bg-muted/40 rounded-lg px-4 py-3">
          <p className="text-xs text-muted-foreground mb-0.5">Cierre</p>
          {detail.closedAt
            ? <p className="font-medium">{fmt(detail.closedAt)}</p>
            : <p className="text-secondary font-medium text-xs">Caja abierta</p>}
        </div>
        <div className="bg-muted/40 rounded-lg px-4 py-3">
          <p className="text-xs text-muted-foreground mb-0.5">Efectivo inicial</p>
          <p className="font-medium">Bs. {detail.initialAmount.toFixed(2)}</p>
        </div>
        <div className="bg-muted/40 rounded-lg px-4 py-3">
          <p className="text-xs text-muted-foreground mb-0.5">Efectivo en caja</p>
          <p className="text-secondary font-semibold">Bs. {detail.expectedCash.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-secondary/10 border border-secondary/30 rounded-lg px-4 py-3 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-secondary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Total cobrado</p>
            <p className="text-lg font-bold text-secondary">Bs. {totalSales.toFixed(2)}</p>
          </div>
        </div>
        {totalExtraIncome > 0 && (
          <div className="bg-info/10 border border-info/30 rounded-lg px-4 py-3 flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-info shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Ingresos extra</p>
              <p className="text-lg font-bold text-info">Bs. {totalExtraIncome.toFixed(2)}</p>
            </div>
          </div>
        )}
        {totalExpenses > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Egresos</p>
              <p className="text-lg font-bold text-destructive">− Bs. {totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Pagos recibidos ({detail.payments.length})
        </p>
        {detail.payments.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">Sin pagos en esta sesión</p>
        ) : (
          <div className="space-y-1">
            {detail.payments.map((p) => {
              const studentName = p.debt.inscription?.student
                ? `${p.debt.inscription.student.user.name} ${p.debt.inscription.student.user.lastName}`
                : p.debt.inscription?.booking?.name ?? '—';
              return (
                <div key={p.id} className="flex justify-between items-center text-sm bg-muted/30 rounded-lg px-3 py-2">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline" className="text-[11px]">{getTypeDebt(p.debt.type)}</Badge>
                    {studentName}
                    <span className="text-xs">· {p.payMethod}</span>
                  </span>
                  <span className="font-medium">Bs. {p.amount.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {detail.movements.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Ingresos y egresos extras ({detail.movements.length})
          </p>
          <div className="space-y-1">
            {detail.movements.map((m) => (
              <div key={m.id} className="flex justify-between items-center text-sm bg-muted/30 rounded-lg px-3 py-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Badge
                    variant="outline"
                    className={`text-[11px] ${m.type === 'INCOME' ? 'text-secondary border-secondary/40' : 'text-destructive border-destructive/40'}`}
                  >
                    {m.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                  </Badge>
                  {m.description}
                  <span className="text-xs">· {m.payMethod}</span>
                </span>
                <span className={`font-medium ${m.type === 'EXPENSE' ? 'text-destructive' : ''}`}>
                  {m.type === 'EXPENSE' ? '− ' : ''}Bs. {m.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

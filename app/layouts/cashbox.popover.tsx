import { useEffect, useRef, useState } from 'react';
import { useAuthStore, useCashBoxStore, useForm } from '@/hooks';
import { formOpenCashBoxInit, formOpenCashBoxValidations } from '@/models';
import { InputCustom } from '@/components';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export const CashBoxPopover = ({
  anchorEl,
  onClose,
  open,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  open: boolean;
}) => {
  const { branchSelect } = useAuthStore();
  const { active, summary, loading, fetchActive, fetchSummary, openBox, closeBox } = useCashBoxStore();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { initialAmount, onDecimalChange, isFormValid, initialAmountValid, onResetForm } = useForm(
    formOpenCashBoxInit,
    formOpenCashBoxValidations,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target) && anchorEl && !anchorEl.contains(target)) {
        onClose();
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, anchorEl, onClose]);

  useEffect(() => {
    if (open && branchSelect?.id) {
      fetchActive(branchSelect.id).then((a) => {
        if (a) fetchSummary(branchSelect.id);
      });
    }
  }, [open, branchSelect?.id]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom + window.scrollY;
  const left = rect.left + window.scrollX;

  const handleOpenBox = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid || !branchSelect?.id) return;
    await openBox(branchSelect.id, { initialAmount: parseFloat(initialAmount) || 0 });
    onResetForm();
    setFormSubmitted(false);
    onClose();
  };

  const handleCloseBox = async () => {
    if (!branchSelect?.id) return;
    await closeBox(branchSelect.id);
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 w-72 rounded-md bg-card shadow-lg ring-1 ring-border"
      style={{ top: `${top}px`, left: `${left}px`, transform: 'translateX(-70%)', position: 'absolute' }}
    >
      <div className="py-3 px-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Caja — {branchSelect?.name ?? 'Sin sucursal'}</p>
      </div>
      <div className="border-t border-border" />

      {active === undefined && (
        <div className="py-6 flex justify-center">
          <Spinner className="size-5" />
        </div>
      )}

      {active === null && (
        <form onSubmit={handleOpenBox} className="py-3 px-4 space-y-3">
          <p className="text-sm text-muted-foreground">No hay caja abierta en esta sucursal.</p>
          <InputCustom
            name="initialAmount"
            label="Monto inicial (Bs.)"
            value={initialAmount}
            error={!!initialAmountValid && formSubmitted}
            helperText={formSubmitted ? initialAmountValid : ''}
            {...onDecimalChange('initialAmount')}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            Abrir caja
          </Button>
        </form>
      )}

      {active && (
        <div className="py-3 px-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            Abierta {new Date(active.openedAt).toLocaleString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>

          {summary ? (
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto inicial</span>
                <span>Bs. {summary.initialAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ventas (efectivo)</span>
                <span>Bs. {summary.totalSales.cash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ventas (banco/QR)</span>
                <span>Bs. {(summary.totalSales.bank + summary.totalSales.qr).toFixed(2)}</span>
              </div>
              {(summary.extraIncome.cash + summary.extraIncome.bank + summary.extraIncome.qr) > 0 && (
                <div className="flex justify-between text-secondary-600">
                  <span>Ingresos extra</span>
                  <span>+ Bs. {(summary.extraIncome.cash + summary.extraIncome.bank + summary.extraIncome.qr).toFixed(2)}</span>
                </div>
              )}
              {(summary.expenses.cash + summary.expenses.bank + summary.expenses.qr) > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Egresos</span>
                  <span>- Bs. {(summary.expenses.cash + summary.expenses.bank + summary.expenses.qr).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-1.5 flex justify-between font-semibold">
                <span>Efectivo en caja</span>
                <span>Bs. {summary.expectedCash.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="py-2 flex justify-center">
              <Spinner className="size-4" />
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={handleCloseBox} disabled={loading}>
            Cerrar caja
          </Button>
        </div>
      )}
    </div>
  );
};

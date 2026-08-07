import { useState } from 'react';
import { Button } from '@/components';
import { useAuthStore, useCashMovementStore, usePermissionStore } from '@/hooks';
import { CashMovementType, TypeAction, TypeSubject } from '@/models';
import { CashMovementCreate, CashMovementTable } from '.';

const cashMovementView = () => {
  const { branchSelect } = useAuthStore();
  const { dataCashMovement, getCashMovements, createCashMovement, deleteCashMovement } = useCashMovementStore();
  const { hasPermission } = usePermissionStore();

  const [createType, setCreateType] = useState<CashMovementType | null>(null);

  if (!branchSelect?.id) {
    return <p className="text-muted-foreground text-sm">Selecciona una sucursal para ver su caja.</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Caja — Ingresos y Egresos</h2>
        <div className="flex gap-2">
          {hasPermission(TypeAction.create, TypeSubject.income) && (
            <Button onClick={() => setCreateType(CashMovementType.INCOME)}>
              Nuevo ingreso
            </Button>
          )}
          {hasPermission(TypeAction.create, TypeSubject.expenses) && (
            <Button color="bg-destructive" onClick={() => setCreateType(CashMovementType.EXPENSE)}>
              Nuevo egreso
            </Button>
          )}
        </div>
      </div>

      <CashMovementTable
        dataCashMovement={dataCashMovement}
        onRefresh={(type, page, limit) => getCashMovements(branchSelect.id, type, page, limit)}
        onDelete={(id, type) => deleteCashMovement(id, type, () => getCashMovements(branchSelect.id, undefined))}
      />

      {createType && (
        <CashMovementCreate
          open={!!createType}
          handleClose={() => setCreateType(null)}
          type={createType}
          branchId={branchSelect.id}
          onCreate={(body) => createCashMovement(body, () => getCashMovements(branchSelect.id, undefined))}
        />
      )}
    </>
  );
};

export default cashMovementView;

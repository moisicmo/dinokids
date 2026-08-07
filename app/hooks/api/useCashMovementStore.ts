import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore } from '..';
import { InitBaseResponse, TypeAction, TypeSubject, CashMovementType, type BaseResponse, type CashMovementModel, type CreateCashMovementRequest } from '@/models';
import { useState } from 'react';

export const useCashMovementStore = () => {
  const [dataCashMovement, setDataCashMovement] = useState<BaseResponse<CashMovementModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'cash-movement';

  const getCashMovements = async (branchId: string, type?: CashMovementType, page: number = 1, limit: number = 10) => {
    try {
      requirePermission(TypeAction.read, type === CashMovementType.EXPENSE ? TypeSubject.expenses : TypeSubject.income);
      const { data, meta } = (await coffeApi.get(`/${baseUrl}`, { params: { branchId, type, page, limit } })).data;
      const payload: BaseResponse<CashMovementModel> = { ...meta, data };
      setDataCashMovement(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createCashMovement = async (body: CreateCashMovementRequest, onDone?: () => void) => {
    try {
      requirePermission(
        TypeAction.create,
        body.type === CashMovementType.EXPENSE ? TypeSubject.expenses : TypeSubject.income
      );
      await coffeApi.post(`/${baseUrl}`, body);
      showSuccess(body.type === CashMovementType.EXPENSE ? 'Egreso registrado correctamente' : 'Ingreso registrado correctamente');
      onDone?.();
    } catch (error) {
      throw handleError(error);
    }
  };

  const deleteCashMovement = async (id: string, type: CashMovementType, onDone?: () => void) => {
    try {
      requirePermission(TypeAction.delete, type === CashMovementType.EXPENSE ? TypeSubject.expenses : TypeSubject.income);
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        showSuccess('Movimiento eliminado correctamente');
        onDone?.();
      } else {
        showError('Cancelado', 'El movimiento esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataCashMovement,
    //* Métodos
    getCashMovements,
    createCashMovement,
    deleteCashMovement,
  };
};

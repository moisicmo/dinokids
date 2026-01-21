import { coffeApi } from '@/services';
import { useAppSelector, useErrorStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type DebtModel } from '@/models';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setDebtsByStudent } from '@/store';

export const useDebtStore = () => {
  const [dataDebt, setDataDebt] = useState<BaseResponse<DebtModel>>(InitBaseResponse);
  const { dataDebtByStudent } = useAppSelector(state => state.Debts);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const dispatch = useDispatch();
  const baseUrl = 'debt';

  const getDebts = async (page: number = 1, limit: number = 10, keys: string = ''): Promise<void> => {
    try {
      requirePermission(TypeAction.read, TypeSubject.debt);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<DebtModel> = {
        ...meta,
        data,
      };
      setDataDebt(payload);
    } catch (error) {
      throw handleError(error);
    }
  }

  const getDebtsByStudent = async (studentId: string, page: number = 1, limit: number = 10, keys: string = ''): Promise<void> => {
    try {
      requirePermission(TypeAction.read, TypeSubject.debt);
      const res = await coffeApi.get(`/${baseUrl}/student/${studentId}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<DebtModel> = {
        ...meta,
        data,
      };
      dispatch(setDebtsByStudent(payload));
    } catch (error) {
      throw handleError(error);
    }
  };
  return {
    //* Propiedades
    dataDebt,
    dataDebtByStudent,
    //* Métodos
    getDebts,
    getDebtsByStudent,
  }
}
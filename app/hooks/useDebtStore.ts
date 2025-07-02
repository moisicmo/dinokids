import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setDebts } from '@/store';
import { useAppSelector, useErrorStore } from '.';
import type { DebtModel, DebtResponse } from '@/models';

export const useDebtStore = () => {
  const { dataDebt } = useAppSelector(state => state.Debts);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const baseUrl = 'debt';

  const getDebts = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: DebtResponse = {
        ...meta,
        data,
      };
      dispatch(setDebts(payload));
    } catch (error) {
      throw handleError(error);
    }
  }

  const getDebtsByStudent = async (studentId: string): Promise<DebtModel[]> => {
    try {
      const res = await coffeApi.get(`/${baseUrl}/student/${studentId}`);
      const { data } = res;
      const payload: DebtModel[] = data;
      console.log(payload);
      return payload;
    } catch (error) {
      throw handleError(error);
    }
  };
  return {
    //* Propiedades
    dataDebt,
    //* Métodos
    getDebts,
    getDebtsByStudent,
  }
}
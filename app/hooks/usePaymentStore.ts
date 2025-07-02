import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setDebts } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { CartRequest, DebtResponse } from '@/models';

export const usePaymentStore = () => {
  const { dataDebt } = useAppSelector(state => state.Debts);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  
  const baseUrl = 'payment';

  const getPayments = async (page: number = 1, limit: number = 10, keys: string = '') => {
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

    const sentPayments = async (body: CartRequest) => {
      try {
        const { data } = await coffeApi.post(`/${baseUrl}/sendings`, body);
        console.log(data)
        // getBranches();
        showSuccess('Pago Registrado creado correctamente');
      } catch (error: any) {
        throw handleError(error);
      }
    }

  return {
    //* Propiedades
    dataDebt,
    //* Métodos
    getPayments,
    sentPayments,
  }
}
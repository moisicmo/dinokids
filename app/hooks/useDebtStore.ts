import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setDebts } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { DebtModel, DebtRequest, DebtResponse } from '@/models';

export const useDebtStore = () => {
  const { dataDebt } = useAppSelector(state => state.Debts);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
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


  const createDebt = async (body: DebtRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data)
      getDebts();
      showSuccess('Sucursal creado correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  const updateDebt = async (id: string, body: DebtRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data)
      getDebts();
      showSuccess('Sucursal editado correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  const deleteDebt = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getDebts();
        showSuccess('Sucursal eliminado correctamente');
      } else {
        showError('Cancelado', 'La sucursal esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  }
  return {
    //* Propiedades
    dataDebt,
    //* Métodos
    getDebts,
    getDebtsByStudent,
    createDebt,
    updateDebt,
    deleteDebt,
  }
}
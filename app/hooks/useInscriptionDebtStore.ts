import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setInscriptiondebts } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { InscriptionDebtRequest, InscriptionDebtResponse } from '@/models';

export const useInscriptionDebtStore = () => {
  const { dataInscriptionDebt } = useAppSelector(state => state.inscriptionDebts);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'inscription-debt';

  const getInscriptionDebts = async (page: number = 1, limit: number = 10, keys: string = '') => {

    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: InscriptionDebtResponse = {
        ...meta,
        data,
      };
      dispatch(setInscriptiondebts(payload));
    } catch (error) {
      throw handleError(error);
    }

  }

  const createInscriptionDebt = async (body: InscriptionDebtRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data)
      getInscriptionDebts();
      showSuccess('Sucursal creado correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  const updateInscriptionDebt = async (id: string, body: InscriptionDebtRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data)
      getInscriptionDebts();
      showSuccess('Sucursal editado correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  const deleteInscriptionDebt = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getInscriptionDebts();
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
    dataInscriptionDebt,
    //* Métodos
    getInscriptionDebts,
    createInscriptionDebt,
    updateInscriptionDebt,
    deleteInscriptionDebt,
  }
}
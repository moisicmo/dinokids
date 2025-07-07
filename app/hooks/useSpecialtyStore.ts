import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type SpecialtyModel, type SpecialtyRequest } from '@/models';
import { useState } from 'react';

export const useSpecialtyStore = () => {
  const [dataSpecialty, setDataSpecialty] = useState<BaseResponse<SpecialtyModel>>(InitBaseResponse);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'specialty';

  const getSpecialties = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<SpecialtyModel> = {
        ...meta,
        data,
      };
      setDataSpecialty(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const getSpecialtiesByBranch = async (branchId: string, page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}/branch/${branchId}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<SpecialtyModel> = {
        ...meta,
        data,
      };
      setDataSpecialty(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createSpecialty = async (body: SpecialtyRequest) => {
    try {
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      getSpecialties();
      showSuccess('Especialidad creada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateSpecialty = async (id: string, body: SpecialtyRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getSpecialties();
      showSuccess('Especialidad editada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteSpecialty = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getSpecialties();
        showSuccess('Especialidad eliminado correctamente');
      } else {
        showError('Cancelado', 'El módulo esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataSpecialty,
    //* Métodos
    getSpecialties,
    getSpecialtiesByBranch,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  };
};

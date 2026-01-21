import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type BranchSpecialtiesModel, type SpecialtyModel, type SpecialtyRequest } from '@/models';
import { useState } from 'react';

export const useSpecialtyStore = () => {
  const [dataSpecialty, setDataSpecialty] = useState<BaseResponse<BranchSpecialtiesModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'specialty';

  const getSpecialties = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      requirePermission(TypeAction.read, TypeSubject.specialty);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<BranchSpecialtiesModel> = {
        ...meta,
        data,
      };
      setDataSpecialty(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  // const getSpecialtiesByBranch = async (branchId: string, page: number = 1, limit: number = 10, keys: string = '') => {
  //   try {
  //     requirePermission(TypeAction.read, TypeSubject.specialty);
  //     const res = await coffeApi.get(`/${baseUrl}/branch/${branchId}?page=${page}&limit=${limit}&keys=${keys}`);
  //     const { data, meta } = res.data;
  //     console.log(res.data);
  //     const payload: BaseResponse<BranchSpecialtiesModel> = {
  //       ...meta,
  //       data,
  //     };
  //     setDataSpecialty(payload);
  //   } catch (error) {
  //     throw handleError(error);
  //   }
  // };

  const createSpecialty = async (body: SpecialtyRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.specialty);
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
      requirePermission(TypeAction.update, TypeSubject.specialty);
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
      requirePermission(TypeAction.delete, TypeSubject.specialty);
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
    // getSpecialtiesByBranch,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  };
};

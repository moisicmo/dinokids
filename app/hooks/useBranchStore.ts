import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type BranchModel, type BranchRequest } from '@/models';
import { useState } from 'react';

export const useBranchStore = () => {
  const [dataBranch, setDataBranch] = useState<BaseResponse<BranchModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'branch';

  const getBranches = async (page: number = 1, limit: number = 10, keys: string = '') => {

    try {
      requirePermission(TypeAction.read, TypeSubject.branch);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<BranchModel> = {
        ...meta,
        data,
      };
      setDataBranch(payload);
    } catch (error) {
      throw handleError(error);
    }

  }

  const createBranch = async (body: BranchRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.branch);
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data)
      getBranches();
      showSuccess('Sucursal creado correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  const updateBranch = async (id: string, body: BranchRequest) => {
    try {
      requirePermission(TypeAction.update, TypeSubject.branch);
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data)
      getBranches();
      showSuccess('Sucursal editado correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  const deleteBranch = async (id: string) => {
    try {
      requirePermission(TypeAction.delete, TypeSubject.branch);
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getBranches();
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
    dataBranch,
    //* Métodos
    getBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  }
}
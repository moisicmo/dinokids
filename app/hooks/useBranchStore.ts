import { coffeApi } from '@/services';
import { useAlertStore, useAuthStore, useErrorStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type BranchModel, type BranchRequest } from '@/models';
import { useDispatch } from 'react-redux';
import { setBranch, setBranchesUser } from '@/store';
import { useState } from 'react';

export const useBranchStore = () => {
  const [dataBranch, setDataBranch] = useState<BaseResponse<BranchModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const { branchesUser, branchSelect } = useAuthStore();
  const dispatch = useDispatch();
  const baseUrl = 'branch';

  const getAllBranches = async (): Promise<{ id: string; name: string }[]> => {
    try {
      const { data } = await coffeApi.get('/branch/all');
      return data;
    } catch (error) {
      throw handleError(error);
    }
  };

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

  const createBranch = async (body: BranchRequest): Promise<BranchModel> => {
    try {
      requirePermission(TypeAction.create, TypeSubject.branch);
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data)
      getBranches();
      showSuccess('Sucursal creado correctamente');
      return data;
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

        // Sync branch selector: remove deleted branch from user's list
        const updatedBranches = branchesUser.filter(b => b.id !== id);
        dispatch(setBranchesUser({ branches: updatedBranches }));
        localStorage.setItem('branches', JSON.stringify(updatedBranches));

        // If the deleted branch was selected, clear it
        if (branchSelect?.id === id) {
          dispatch(setBranch({ branch: null }));
          localStorage.removeItem('branchSelect');
        }

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
    getAllBranches,
    getBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  }
}
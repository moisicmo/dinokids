import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setPermissions } from '@/store';
import { useAppSelector, useErrorStore } from '.';
import type { PermissionResponse } from '@/models';


export const usePermissionStore = () => {
  const { dataPermission } = useAppSelector(state => state.permissions);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const baseUrl = 'permission';

  const getPermissions = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: PermissionResponse = {
        ...meta,
        data,
      };
      dispatch(setPermissions(payload));
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataPermission,
    //* Métodos
    getPermissions,
  };
};

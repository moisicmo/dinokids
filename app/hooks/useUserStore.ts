import { coffeApi } from '@/services';
import { useErrorStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type UserModel, type UserRequest } from '@/models';
import { useState } from 'react';

export const useUserStore = () => {
  const [dataUser, setDataUser] = useState<BaseResponse<UserModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const baseUrl = 'user';

  const getByRole = async (role: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.user);
      const res = await coffeApi.get(`/${baseUrl}/by-role/${role}`);
      const { data, meta } = res.data;
      const payload: BaseResponse<UserModel> = {
        ...meta,
        data,
      };      
      setDataUser(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataUser,
    //* Métodos
    getByRole,
  };
};

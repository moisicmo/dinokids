import { coffeApi } from '@/services';
import { useAuthStore, useErrorStore } from '..';
import { useState } from 'react';
import { InitBaseResponse, TypeSubject, TypeAction, type BaseResponse, type PermissionModel } from '@/models';
import { formatTypeAction } from '@/lib/utils';

export const usePermissionStore = () => {
  const [dataPermission, setDataPermission] = useState<BaseResponse<PermissionModel>>(InitBaseResponse);

  const { handleError } = useErrorStore();
  const { roleUser } = useAuthStore();

  const baseUrl = 'permission';

  // Catálogo de solo lectura — no hay create/update/delete porque el
  // backend no los expone (PermissionController solo tiene @Get). Los
  // permisos son estructurales, se seedean; lo editable es qué permisos
  // tiene cada Rol.
  const getPermissions = async (page: number = 1, limit: number = 10000, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      const payload: BaseResponse<PermissionModel> = {
        ...meta,
        data,
      };
      setDataPermission(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const checkPermission = (action: TypeAction, subject: TypeSubject): boolean => {
    if (!roleUser) return false;
    const permissionKey = `${action}-${subject}`;
    return roleUser.permissions.some((per) => {
      const perAction = formatTypeAction(per.action);
      if (perAction === TypeAction.manage && per.subject === subject) return true;
      return `${perAction}-${per.subject}` === permissionKey;
    });
  };

  const requirePermission = (action: TypeAction, subject: TypeSubject, errorMessage?: string) => {
    if (!checkPermission(action, subject)) {
      // throw  showError('Necesitas permisos', `No tienes permiso para ${action} ${subject}`);
      throw new Error(errorMessage || `No tienes permiso para ${action} ${subject}`);
    }
  };

  const hasPermission = (action: TypeAction, subject: TypeSubject): boolean => {
    try {
      requirePermission(action, subject);
      return true;
    } catch {
      return false;
    }
  };

  return {
    //* Propiedades
    dataPermission,
    //* Métodos
    getPermissions,
    // evaluation permissions
    checkPermission,
    requirePermission,
    hasPermission,
    hasAnyPermission: !!roleUser?.permissions.length,
  };
};

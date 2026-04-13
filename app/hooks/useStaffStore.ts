import { coffeApi } from '@/services';
import { useAlertStore, useAuthStore, useErrorStore, useLogoutStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type StaffModel, type StaffRequest } from '@/models';
import { useState } from 'react';
import Swal from 'sweetalert2';

export const useStaffStore = () => {
  const [dataStaff, setDataStaff] = useState<BaseResponse<StaffModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const { userId } = useAuthStore();
  const { startLogout } = useLogoutStore();
  const baseUrl = 'staff';

  interface GetStaffParams {
    page?: number;
    limit?: number;
    keys?: string;
    role?: string;
  }

  const getStaffs = async ({page = 1, limit = 10, keys = '', role = ''}: GetStaffParams = {}) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.staff);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}&role=${role}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<StaffModel> = {
        ...meta,
        data,
      };
      setDataStaff(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createStaff = async (body: StaffRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.staff);
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data);
      getStaffs();
      showSuccess('Staff creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateStaff = async (id: string, body: StaffRequest) => {
    try {
      requirePermission(TypeAction.update, TypeSubject.staff);
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getStaffs();

      if (id === userId) {
        await Swal.fire({
          title: 'Tu perfil fue actualizado',
          text: 'Tu rol o sucursales cambiaron. Debes volver a iniciar sesión para aplicar los cambios.',
          icon: 'info',
          confirmButtonText: 'Volver a iniciar sesión',
          confirmButtonColor: '#B0008E',
          allowOutsideClick: false,
        });
        startLogout();
        return;
      }

      showSuccess('Staff editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteStaff = async (id: string) => {
    try {
      requirePermission(TypeAction.delete, TypeSubject.staff);

      if (id === userId) {
        await Swal.fire({
          title: 'Acción no permitida',
          text: 'No puedes eliminar tu propio usuario.',
          icon: 'warning',
          confirmButtonColor: '#B0008E',
        });
        return;
      }

      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getStaffs();
        showSuccess('Staff eliminado correctamente');
      } else {
        showError('Cancelado', 'El Staff esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataStaff,
    //* Métodos
    getStaffs,
    createStaff,
    updateStaff,
    deleteStaff,
  };
};

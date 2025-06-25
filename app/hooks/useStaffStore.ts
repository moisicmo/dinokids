import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setStaffs } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { StaffRequest, StaffResponse } from '@/models';

export const useStaffStore = () => {
  const { dataStaff } = useAppSelector(state => state.staffs);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'staff';

  const getStaffs = async (page = 1, limit = 10, keys = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: StaffResponse = {
        ...meta,
        data,
      };
      dispatch(setStaffs(payload));
    } catch (error) {
      throw handleError(error);
    }
  };

  const createStaff = async (body: StaffRequest) => {
    try {
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
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getStaffs();
      showSuccess('Staff editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteStaff = async (id: string) => {
    try {
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

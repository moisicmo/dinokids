import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setTeachers } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { TeacherRequest, TeacherResponse } from '@/models';

export const useTeacherStore = () => {
  const { dataTeacher } = useAppSelector(state => state.teachers);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'teacher';

  const getTeachers = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: TeacherResponse = {
        ...meta,
        data,
      };
      dispatch(setTeachers(payload));
    } catch (error) {
      throw handleError(error);
    }
  };
  const createTeacher = async (body: TeacherRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data);
      getTeachers();
      showSuccess('Docente creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateTeacher = async (id: string, body: TeacherRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getTeachers();
      showSuccess('Docente editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteTeacher = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getTeachers();
        showSuccess('Docente eliminado correctamente');
      } else {
        showError('Cancelado', 'El Docente esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataTeacher,
    //* Métodos
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};

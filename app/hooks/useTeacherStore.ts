import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type TeacherModel, type TeacherRequest } from '@/models';
import { useState } from 'react';

export const useTeacherStore = () => {
  const [dataTeacher, setDataTeacher] = useState<BaseResponse<TeacherModel>>(InitBaseResponse);
  
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'teacher';

  const getTeachers = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<TeacherModel> = {
        ...meta,
        data,
      };
      setDataTeacher(payload);
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

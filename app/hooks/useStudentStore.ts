import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setStudents } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { StudentRequest, StudentResponse } from '@/models';

export const useStudentStore = () => {
  const { dataStudent } = useAppSelector(state => state.students);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'student';

  const getStudents = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: StudentResponse = {
        ...meta,
        data,
      };
      dispatch(setStudents(payload));
    } catch (error) {
      throw handleError(error);
    }
  };
  const createStudent = async (body: StudentRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data);
      getStudents();
      showSuccess('Estudiante creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateStudent = async (id: string, body: StudentRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getStudents();
      showSuccess('Estudiante editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteStudent = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getStudents();
        showSuccess('Estudiante eliminado correctamente');
      } else {
        showError('Cancelado', 'El Estudiante esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataStudent,
    //* Métodos
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
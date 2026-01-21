import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type StudentModel, type StudentRequest } from '@/models';
import { useState } from 'react';

export const useStudentStore = () => {
  const [dataStudent, setDataStudent] = useState<BaseResponse<StudentModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'student';

  const getStudents = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      requirePermission(TypeAction.read, TypeSubject.student);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<StudentModel> = {
        ...meta,
        data,
      };
      setDataStudent(payload);
    } catch (error) {
      throw handleError(error);
    }
  };
  const createStudent = async (body: StudentRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.student);
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
      requirePermission(TypeAction.update, TypeSubject.student);
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
      requirePermission(TypeAction.delete, TypeSubject.student);
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
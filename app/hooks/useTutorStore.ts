import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type TutorModel, type TutorRequest } from '@/models';


export const useTutorStore = () => {
  const [dataTutor, setDataTutor] = useState<BaseResponse<TutorModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'tutor';

  const getTutors = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      requirePermission(TypeAction.read, TypeSubject.tutor);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      const payload: BaseResponse<TutorModel> = {
        ...meta,
        data,
      };
      setDataTutor(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createTutor = async (body: TutorRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.tutor);
      await coffeApi.post(`/${baseUrl}/`, body);
      await getTutors();
      showSuccess('Tutor creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  const updateTutor = async (id: string, body: TutorRequest) => {
    try {
      requirePermission(TypeAction.update, TypeSubject.tutor);
      await coffeApi.patch(`/${baseUrl}/${id}`, body);
      await getTutors();
      showSuccess('Tutor editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  const deleteTutor = async (id: string) => {
    try {
      requirePermission(TypeAction.delete, TypeSubject.tutor);
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        await getTutors();
        showSuccess('Tutor eliminado correctamente');
      } else {
        showError('Cancelado', 'El Tutor está a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataTutor,
    //* Métodos
    getTutors,
    createTutor,
    updateTutor,
    deleteTutor,
  };
};

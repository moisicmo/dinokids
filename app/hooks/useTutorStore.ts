import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setTutors } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { TutorRequest, TutorResponse } from '@/models';

export const useTutorStore = () => {
  const { dataTutor } = useAppSelector(state => state.tutors);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'tutor';

  const getTutors = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: TutorResponse = {
        ...meta,
        data,
      };
      dispatch(setTutors(payload));
    } catch (error) {
      throw handleError(error);
    }
  };
  const createTutor = async (body: TutorRequest) => {
    try {
      await coffeApi.post(`/${baseUrl}/`, body);
      getTutors();
      showSuccess('Tutor creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateTutor = async (id: string, body: TutorRequest) => {
    try {
      await coffeApi.patch(`/${baseUrl}/${id}`, body);
      getTutors();
      showSuccess('Tutor editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteTutor = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getTutors();
        showSuccess('tutor eliminado correctamente');
      } else {
        showError('Cancelado', 'El Tutor esta a salvo :)');
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

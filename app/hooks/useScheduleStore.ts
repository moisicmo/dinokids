import { useDispatch, useSelector } from 'react-redux';
import { coffeApi } from '@/services';
import {
  setSchedules,
} from '@/store';
import { useAlertStore, useErrorStore } from '.';
import type { DataModel, ScheduleRequest } from '@/models';

interface RootState {
  schedules: {
    dataSchedule: DataModel;
  };
}
export const useScheduleStore = () => {
  const { dataSchedule } = useSelector((state: RootState) => state.schedules);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'schedule';

  const getSchedules = async (roomId: number, page: number = 0, limit: number = 100, keys: string = '') => {
    try {
      const { data } = await coffeApi.get(`/${baseUrl}/${roomId}?page=${page}&limit=${limit}&keys=${keys}`);
      console.log(data);
      dispatch(setSchedules(data));
    } catch (error) {
      throw handleError(error);
    }
  };
  const createSchedule = async (body: ScheduleRequest) => {
    try {
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      getSchedules(body.roomId);
      showSuccess('Horario creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateSchedule = async ( id: number, body: ScheduleRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getSchedules(body.roomId);
      showSuccess('Horario editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteSchedule = async (roomId: number, id: number) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getSchedules(roomId);
        showSuccess('Horario eliminado correctamente');
      } else {
        showError('Cancelado', 'La aula esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataSchedule,
    //* Métodos
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
};

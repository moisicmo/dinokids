import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type RoomModel, type RoomRequest } from '@/models';
import { useState } from 'react';

export const useRoomStore = () => {
  const [dataRoom, setDataRoom] = useState<BaseResponse<RoomModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'room';

  const getRooms = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<RoomModel> = {
        ...meta,
        data,
      };
      setDataRoom(payload);
    } catch (error) {
      throw handleError(error);
    }
  };
  const createRoom = async (body: RoomRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data);
      getRooms();
      showSuccess('Aula creada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateRoom = async (id: string, body: RoomRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getRooms();
      showSuccess('Aula editada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteRoom = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getRooms();
        showSuccess('Aula eliminado correctamente');
      } else {
        showError('Cancelado', 'La aula esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataRoom,
    //* Métodos
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};

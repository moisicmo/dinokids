import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type CorrespondenceRequest, type DocumentTransmissionModel } from '@/models';
import { useState } from 'react';

export const useCorrespondenceStore = () => {
  const [dataCorrespondence, setDataCorrespondence] = useState<BaseResponse<DocumentTransmissionModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess } = useAlertStore();
  const baseUrl = 'correspondence';

  const getCorrespondencees = async (page: number = 1, limit: number = 10, keys: string = '') => {

    try {
      requirePermission(TypeAction.read, TypeSubject.correspondence);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<DocumentTransmissionModel> = {
        ...meta,
        data,
      };
      setDataCorrespondence(payload);
    } catch (error) {
      throw handleError(error);
    }

  }

  const createCorrespondence = async (body: CorrespondenceRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.correspondence);
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data)
      getCorrespondencees();
      showSuccess('Correspondencia creada correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  return {
    //* Propiedades
    dataCorrespondence,
    //* Métodos
    getCorrespondencees,
    createCorrespondence,
  }
}
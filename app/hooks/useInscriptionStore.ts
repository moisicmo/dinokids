import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore, usePrintStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type InscriptionModel, type InscriptionRequest } from '@/models';
import { useState } from 'react';

export const useInscriptionStore = () => {
  const [dataInscription, setDataInscription] = useState<BaseResponse<InscriptionModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showLoading, showSuccess, showWarning, showError, swalClose } = useAlertStore();
  const { handlePdf } = usePrintStore();
  const baseUrl = 'inscription';

  const getInscriptions = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      requirePermission(TypeAction.read, TypeSubject.inscription);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<InscriptionModel> = {
        ...meta,
        data,
      };
      setDataInscription(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const getPdf = async (id: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.inscription);
      showLoading('Obteniendo el pdf...');
      const res = await coffeApi.get(`/${baseUrl}/pdf/${id}`);
      const { pdfBase64 } = res.data;
      await handlePdf(pdfBase64);
      swalClose();
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  }

  const createInscription = async (body: InscriptionRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.inscription);
      showLoading('Creando inscripción..');
      const res = await coffeApi.post(`/${baseUrl}/`, body);
      const { pdfBase64 } = res.data;
      await getInscriptions();
      showSuccess('Incripción creado correctamente');
      await handlePdf(pdfBase64);
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateInscription = async (id: string, inscriptionRequest: InscriptionRequest) => {
    try {
      requirePermission(TypeAction.update, TypeSubject.inscription);
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteInscription = async (id: string) => {
    try {
      requirePermission(TypeAction.delete, TypeSubject.inscription);
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/inscription/${id}`);
        getInscriptions();
        showSuccess('inscripción eliminado correctamente');
      } else {
        showError('Cancelado', 'La inscripción esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataInscription,
    //* Métodos
    getInscriptions,
    getPdf,
    createInscription,
    updateInscription,
    deleteInscription,
  };
};

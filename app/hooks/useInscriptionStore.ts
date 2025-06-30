import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setInscriptions } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore, usePrintStore } from '.';
import type { InscriptionRequest, InscriptionResponse } from '@/models';

export const useInscriptionStore = () => {
  const { dataInscription } = useAppSelector(state => state.inscriptions);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showLoading,showSuccess, showWarning, showError, swalClose } = useAlertStore();
  const { handlePdf } = usePrintStore();
  const baseUrl = 'inscription';

  const getInscriptions = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: InscriptionResponse = {
        ...meta,
        data,
      };
      dispatch(setInscriptions(payload));
    } catch (error) {
      throw handleError(error);
    }
  };

  const getPdf = async (id:string) => {
    try {
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
      showLoading('Creando inscripción..');
      const res = await coffeApi.post(`/${baseUrl}/`, body);
      const { pdfBase64 } = res.data;
      getInscriptions();
      showSuccess('Incripción creado correctamente');
      await handlePdf(pdfBase64);
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateInscription = async (id: string, inscriptionRequest: InscriptionRequest) => {
    try {
      // console.log(inscriptionRequest)
      // const body = {
      //   studentId: inscriptionRequest.student?.id,
      //   rooms: inscriptionRequest.rooms?.map((room) => ({ id: room.id, assignmentSchedule: room.assignmentSchedule, start: room.start })),
      //   inscriptionPrice: inscriptionRequest.inscriptionPrice,
      //   monthPrice: inscriptionRequest.monthPrice,
      // }
      // const { data } = await coffeApi.patch(`/inscription/${id}`, body);
      // console.log(data);
      // getInscriptions();
      // showSuccess('Inscripción editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteInscription = async (id: string) => {
    try {
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

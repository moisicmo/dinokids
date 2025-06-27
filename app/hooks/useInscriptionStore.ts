import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setInscriptions, setClearCart } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { InscriptionRequest, InscriptionResponse } from '@/models';

export const useInscriptionStore = () => {
  const { dataInscription } = useAppSelector(state => state.inscriptions);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'inscription';

  const getInscriptions = async (page: number = 0, limit: number = 10, keys: string = '') => {
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

  const getInscriptionDebts = async (page: number = 0, limit: number = 10, keys: string = '') => {
    try {
      const { data } = await coffeApi.get(`/${baseUrl}/debt?page=${page}&limit=${limit}&keys=${keys}`);
      console.log(data);
      dispatch(setInscriptions(data));
    } catch (error) {
      throw handleError(error);
    }
  };

  const payInscriptionDebt = async (body: object) => {
    try {
      console.log(body)
      const { data } = await coffeApi.post(`/${baseUrl}/debt/pay/`, body);
      console.log(data);
      getInscriptionDebts();
      // dispatch(addPayment({ payments: data.payments }));
      // PDF
      const byteCharacters = atob(data.document.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const pdfURL = window.URL.createObjectURL(blob);
          if (typeof window !== 'undefined') {
      const printJS = (await import('print-js')).default;
      printJS(pdfURL);
    }

      showSuccess('Comprobante de pago creado correctamente');
      dispatch(setClearCart()); // limpiar carrito

    } catch (error) {
      throw handleError(error);
    }
  }

  const createInscription = async (inscriptionRequest: InscriptionRequest) => {
    try {
    //   console.log(inscriptionRequest)
    //   const body = {
    //     studentId: inscriptionRequest.student?.id,
    //     rooms: inscriptionRequest.rooms?.map((room) => ({ id: room.id, assignmentSchedule: room.assignmentSchedule, start: room.start })),
    //     inscriptionPrice: inscriptionRequest.inscriptionPrice,
    //     monthPrice: inscriptionRequest.monthPrice,
    //   }
    //   const { data } = await coffeApi.post('/inscription/', body);
    //   console.log(data);
    //   getInscriptions();
    //   // PDF
    //   const byteCharacters = atob(data.document.pdfBase64);
    //   const byteNumbers = new Array(byteCharacters.length);
    //   for (let i = 0; i < byteCharacters.length; i++) {
    //     byteNumbers[i] = byteCharacters.charCodeAt(i);
    //   }
    //   const byteArray = new Uint8Array(byteNumbers);
    //   const blob = new Blob([byteArray], { type: 'application/pdf' });
    //   const pdfURL = window.URL.createObjectURL(blob);
    //       if (typeof window !== 'undefined') {
    //   const printJS = (await import('print-js')).default;
    //   printJS(pdfURL);
    // }

    //   showSuccess('Inscripción creado correctamente');
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

    getInscriptionDebts,
    payInscriptionDebt,

    createInscription,
    updateInscription,
    deleteInscription,
  };
};

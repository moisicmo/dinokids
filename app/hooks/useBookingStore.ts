import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePermissionStore, usePrintStore } from '.';
import { InitBaseResponse, TypeAction, TypeSubject, type BaseResponse, type BookingRequest, type InscriptionModel } from '@/models';
import { useState } from 'react';

export const useBookingStore = () => {
  const [dataBooking, setDataBooking] = useState<BaseResponse<InscriptionModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();
  const { showSuccess, showWarning, showError, showLoading, swalClose } = useAlertStore();
  const baseUrl = 'booking';

  const { handlePdf } = usePrintStore();

  const getBookings = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      requirePermission(TypeAction.read, TypeSubject.booking);
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<InscriptionModel> = {
        ...meta,
        data,
      };;
      setDataBooking(payload);
    } catch (error) {
      throw handleError(error);
    }
  };
  const createBooking = async (body: BookingRequest) => {
    try {
      requirePermission(TypeAction.create, TypeSubject.booking);
      showLoading('Registrando la reserva..');
      const res = await coffeApi.post(`/${baseUrl}/`, body);
      const { pdfBase64 } = res.data;
      swalClose();
      await handlePdf(pdfBase64)
      getBookings();
      showSuccess('Reserva creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateBooking = async (id: string, body: BookingRequest) => {
    try {
      requirePermission(TypeAction.update, TypeSubject.booking);
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getBookings();
      showSuccess('Reserva editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteBooking = async (id: string) => {
    try {
      requirePermission(TypeAction.delete, TypeSubject.booking);
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getBookings();
        showSuccess('Reserva eliminada correctamente');
      } else {
        showError('Cancelado', 'La reserva esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataBooking,
    //* Métodos
    getBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
};

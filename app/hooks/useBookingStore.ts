import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { setBookings } from '@/store';
import { useAlertStore, useAppSelector, useErrorStore } from '.';
import type { BookingRequest, BookingResponse } from '@/models';

export const useBookingStore = () => {
  const { dataBooking } = useAppSelector(state => state.bookings);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'booking';

  const getbookings = async (page: number = 0, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BookingResponse = {
        ...meta,
        data,
      };
      dispatch(setBookings(payload));
    } catch (error) {
      throw handleError(error);
    }
  };
  const createBooking = async (body: BookingRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data);
      getbookings();
      showSuccess('Reserva creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateBooking = async (id: string, body: BookingRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getbookings();
      showSuccess('Reserva editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteBooking = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getbookings();
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
    getbookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
};

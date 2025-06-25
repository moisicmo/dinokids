import { useDispatch, useSelector } from 'react-redux';
import { coffeApi } from '@/services';
import {
  setBookings,
} from '@/store';
import { useAlertStore, useErrorStore } from '.';
import type { BookingRequest, DataModel } from '@/models';

interface RootState {
  bookings: {
    dataBooking: DataModel;
  };
}
export const useBookingStore = () => {
  const { dataBooking } = useSelector((state: RootState) => state.bookings);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'booking';

  const getbookings = async (page: number = 0, limit: number = 10, keys: string = '') => {
    try {
      const { data } = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      console.log(data);
      dispatch(setBookings(data));
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
  const updateBooking = async (id: number, body: BookingRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getbookings();
      showSuccess('Reserva editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteBooking = async (id: number) => {
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

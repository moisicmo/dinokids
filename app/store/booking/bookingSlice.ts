import type { DataModel } from '@/models';
import { createSlice } from '@reduxjs/toolkit';

const initialData: DataModel = {
  page: 0,
  limit: 10,
  total: 0,
  bookings: []
}
export const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    dataBooking: initialData,
  },
  reducers: {
    setBookings: (state, action) => {
      state.dataBooking = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setBookings,
} = bookingSlice.actions;

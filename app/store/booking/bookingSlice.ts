import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BookingResponse } from '@/models';

const initialData: BookingResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    dataBooking: initialData,
  },
  reducers: {
    setBookings: (state, action: PayloadAction<BookingResponse>) => {
      state.dataBooking = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBookings } = bookingSlice.actions;

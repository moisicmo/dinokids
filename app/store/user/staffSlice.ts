import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StaffResponse } from '@/models';

const initialData: StaffResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    dataStaff: initialData,
  },
  reducers: {
    setStaffs: (state, action: PayloadAction<StaffResponse>) => {
      state.dataStaff = action.payload;
    },
  },
});

export const { setStaffs } = staffSlice.actions;

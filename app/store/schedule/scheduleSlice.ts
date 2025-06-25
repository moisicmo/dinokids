import type { DataModel } from '@/models';
import { createSlice } from '@reduxjs/toolkit';


const initialData: DataModel = {
  page: 0,
  limit: 10,
  total: 0,
  schedules: []
}
export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    dataSchedule: initialData,
  },
  reducers: {
    setSchedules: (state, action) => {
      state.dataSchedule = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSchedules,
} = scheduleSlice.actions;

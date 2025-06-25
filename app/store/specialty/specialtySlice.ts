import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SpecialtyResponse } from '@/models';

const initialData: SpecialtyResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const specialtySlice = createSlice({
  name: 'specialty',
  initialState: {
    dataSpecialty:initialData
  },
  reducers: {
    setSpecialties: (state, action: PayloadAction<SpecialtyResponse>) => {
      state.dataSpecialty = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSpecialties } = specialtySlice.actions;

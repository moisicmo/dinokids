import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InscriptionResponse } from '@/models';

const initialData: InscriptionResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const inscriptionSlice = createSlice({
  name: 'inscription',
  initialState: {
    dataInscription: initialData,
  },
  reducers: {
    setInscriptions: (state, action: PayloadAction<InscriptionResponse>) => {
      state.dataInscription = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setInscriptions } = inscriptionSlice.actions;

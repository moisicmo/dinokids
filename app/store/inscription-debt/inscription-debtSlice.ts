import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InscriptionDebtResponse } from '@/models';

const initialData: InscriptionDebtResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const inscriptiondebtSlice = createSlice({
  name: 'inscriptiondebt',
  initialState: {
    dataInscriptionDebt: initialData,
  },
  reducers: {
    setInscriptiondebts: (state, action: PayloadAction<InscriptionDebtResponse>) => {
      state.dataInscriptionDebt = action.payload;
    },
  }
});

// Action creators are generated for each case reducer function
export const { setInscriptiondebts } = inscriptiondebtSlice.actions;
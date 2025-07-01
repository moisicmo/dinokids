import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DebtResponse } from '@/models';

const initialData: DebtResponse = {
  page: 1,
  total: 0,
  lastPage: 0,
  data: [],
};

export const debtSlice = createSlice({
  name: 'debt',
  initialState: {
    dataDebt: initialData,
  },
  reducers: {
    setDebts: (state, action: PayloadAction<DebtResponse>) => {
      state.dataDebt = action.payload;
    },
  }
});

// Action creators are generated for each case reducer function
export const { setDebts } = debtSlice.actions;
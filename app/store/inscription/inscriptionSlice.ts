import type { DataModel } from '@/models';
import { createSlice } from '@reduxjs/toolkit';

const initialData: DataModel = {
  page: 0,
  limit: 10,
  total: 0,
  inscriptions: []
}
export const inscriptionSlice = createSlice({
  name: 'inscription',
  initialState: {
    dataInscription: initialData,
  },
  reducers: {
    setInscriptions: (state, action) => {
      state.dataInscription = action.payload;
    },
    



    // addPayment: (state, action) => {
    //   state.inscriptions = state.inscriptions.map((inscription) => {
    //     return {
    //       ...inscription,
    //       inscriptionDebts: inscription.inscriptionDebts.map((insDebt) => {
    //         const payment:PaymentModel = action.payload.payments.find(
    //           (payment:PaymentModel) => insDebt.id === payment.inscriptionDebt.id
    //         );
    //         if (!payment)return insDebt;
    //         return {
    //           ...insDebt,
    //           reaminingBalance: payment.inscriptionDebt.reaminingBalance,
    //           dueDate: payment.inscriptionDebt.dueDate,
    //           payments: [...(insDebt.payments || []), payment],
    //         };
    //       }),
    //     };
    //   });
    // },
  },
});

// Action creators are generated for each case reducer function
export const {
  setInscriptions,
} = inscriptionSlice.actions;

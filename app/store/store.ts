import { configureStore } from '@reduxjs/toolkit';
import {
  authSlice,
  cartSlice,
  debtSlice,
  printSlice,
} from '.';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    Debts: debtSlice.reducer,
    carts:cartSlice.reducer,
    print: printSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

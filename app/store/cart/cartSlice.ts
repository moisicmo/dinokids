import type { FormPaymentModel } from '@/models';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [] as FormPaymentModel[],
  },
  reducers: {
    setClearCart: (state,) => {
      state.cart = [];
    },

    setAddCart: (state, action: PayloadAction<FormPaymentModel>) => {
      // const itemCart:CartModel = payload.itemCart;
      // const item = state.cart.find((item)=> item.DebtModel.id == itemCart.DebtModel.id);
      // if(!item){
      state.cart = [...state.cart, action.payload]
      // }
    },

    setUpdateItemCart: (state, { payload }) => {
      // const itemCart: CartModel = payload.itemCart;
      // state.cart = state.cart.map((item) => {
      //   if (item.DebtModel.id == itemCart.DebtModel.id) {
      //     return itemCart;
      //   }
      //   return item;
      // })
    },

    setRemoveCart: (state, { payload }) => {
      // const itemCart: CartModel = payload.itemCart;
      // state.cart = state.cart.filter(
      //   (e) => e.DebtModel.id !== itemCart.DebtModel.id
      // );
    },


  }
});

// Action creators are generated for each case reducer function
export const {
  setClearCart,
  setAddCart,
  setUpdateItemCart,
  setRemoveCart,
} = cartSlice.actions;
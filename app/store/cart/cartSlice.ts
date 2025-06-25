import type { CartModel } from '@/models';
import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [] as CartModel[],
  },
  reducers: {
    setClearCart: (state, /*{payload}*/) => {
      state.cart = [];
    },

    setAddCart: (state, { payload }) => {
      const itemCart:CartModel = payload.itemCart;
      const item = state.cart.find((item)=> item.inscriptionDebtModel.id == itemCart.inscriptionDebtModel.id);
      if(!item){
        state.cart = [...state.cart,itemCart]
      }
    },

    setUpdateItemCart: (state, { payload })=>{
      const itemCart:CartModel = payload.itemCart;
      state.cart = state.cart.map((item)=>{
        if (item.inscriptionDebtModel.id == itemCart.inscriptionDebtModel.id){
          return itemCart;
        }
        return item;
      })
    },

    setRemoveCart: (state, { payload }) => {
      const itemCart: CartModel = payload.itemCart;
      state.cart = state.cart.filter(
        (e) => e.inscriptionDebtModel.id !== itemCart.inscriptionDebtModel.id
      );
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
import { useDispatch } from 'react-redux';
import { setAddCart, setUpdateItemCart, setRemoveCart } from '@/store';
import type { FormPaymentModel } from '@/models';
import { useAlertStore, useAppSelector } from '.';

export const useCartStore = () => {
  const { cart } = useAppSelector(state => state.carts);
  const dispatch = useDispatch();
  const { showDesition } = useAlertStore();

  const addCard = async (itemCart: FormPaymentModel) => {
    // const isSameStudent = cart.every((e: CartModel) => e.student.userId === itemCart.student.userId);

    // if (isSameStudent || cart.length === 0) {
      dispatch(setAddCart(itemCart));
    // } else {
    //   const result = await showDesition(
    //     'Estás agregando un pago de otro estudiante',
    //     '¿Deseas limpiar el carrito para agregar los pagos del nuevo estudiante?',
    //     '¡Sí, limpiar!'
    //   );
    //   if (result.isConfirmed) {
    //     dispatch(setClearCart());
    //     dispatch(setAddCart({ itemCart }));
    //   }
    // }
  };
  const updateItemCart = async (itemCart: FormPaymentModel) => {
    dispatch(setUpdateItemCart({ itemCart }));
  }

  const removeItemCart = async (itemCart: FormPaymentModel) => {
    dispatch(setRemoveCart(itemCart));
  }


  return {
    //* Propiedades
    cart,
    //* Métodos
    addCard,
    updateItemCart,
    removeItemCart,
  }
}
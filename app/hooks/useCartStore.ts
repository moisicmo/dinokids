import { useDispatch, useSelector } from 'react-redux';
import { setAddCart, setUpdateItemCart, setClearCart, setRemoveCart } from '@/store';
import type { CartModel } from '@/models';
import { useAlertStore } from '.';

export const useCartStore = () => {
  const { cart } = useSelector((state: any) => state.carts);
  const dispatch = useDispatch();
  const { showDesition } = useAlertStore();

  const addCard = async (itemCart: CartModel) => {
    const isSameStudent = cart.every((e: CartModel) => e.student.id === itemCart.student.id);

    if (isSameStudent || cart.length === 0) {
      dispatch(setAddCart({ itemCart }));
    } else {
      const result = await showDesition(
        'Estás agregando un pago de otro estudiante',
        '¿Deseas limpiar el carrito para agregar los pagos del nuevo estudiante?',
        '¡Sí, limpiar!'
      );
      if (result.isConfirmed) {
        dispatch(setClearCart());
        dispatch(setAddCart({ itemCart }));
      }
    }
  };
  const updateItemCart = async (itemCart: CartModel) => {
    dispatch(setUpdateItemCart({itemCart}));
  }

  const removeItem = async (itemCart: CartModel) => {
    dispatch(setRemoveCart({ itemCart }));
  }


  return {
    //* Propiedades
    cart,
    //* Métodos
    addCard,
    updateItemCart,
    removeItem,
  }
}
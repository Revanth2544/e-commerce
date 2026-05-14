import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '../redux/slices/cartSlice';
import { calculateSubtotal, calculateTax, calculateDiscount, calculateTotal } from '../utils/helpers';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, coupon, couponError } = useSelector((state) => state.cart);

  const addItem = useCallback((product) => dispatch(addToCart(product)), [dispatch]);
  const removeItem = useCallback((id) => dispatch(removeFromCart(id)), [dispatch]);
  const setQuantity = useCallback(
    (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    [dispatch]
  );
  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);
  const applyCode = useCallback((code) => dispatch(applyCoupon(code)), [dispatch]);
  const removeCode = useCallback(() => dispatch(removeCoupon()), [dispatch]);

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const discount = useMemo(() => calculateDiscount(subtotal, coupon), [subtotal, coupon]);
  const total = useMemo(() => calculateTotal(subtotal, tax, discount), [subtotal, tax, discount]);
  const itemCount = useMemo(() => items.reduce((c, i) => c + i.quantity, 0), [items]);

  return {
    items,
    coupon,
    couponError,
    subtotal,
    tax,
    discount,
    total,
    itemCount,
    addItem,
    removeItem,
    setQuantity,
    clear,
    applyCode,
    removeCode,
  };
};

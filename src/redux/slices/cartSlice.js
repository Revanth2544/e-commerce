import { createSlice } from '@reduxjs/toolkit';
import { COUPON_CODES } from '../../utils/constants';

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const initialState = {
  items: loadCartFromStorage(),
  coupon: null,
  couponError: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity < 1) return;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.couponError = null;
      saveCartToStorage([]);
    },
    applyCoupon: (state, action) => {
      const code = action.payload.toUpperCase();
      const coupon = COUPON_CODES[code];

      // Format validation
      if (!code || code.length < 3) {
        state.couponError = 'Coupon code must be at least 3 characters';
        state.coupon = null;
        return;
      }

      if (!coupon) {
        state.couponError = 'Invalid coupon code';
        state.coupon = null;
        return;
      }

      // Check expiry
      if (new Date(coupon.expiry) < new Date()) {
        state.couponError = 'This coupon has expired';
        state.coupon = null;
        return;
      }

      // Check minimum cart value
      const subtotal = state.items.reduce((t, i) => t + i.price * i.quantity, 0);
      if (subtotal < coupon.minCart) {
        state.couponError = `Minimum cart value of ₹${coupon.minCart} required`;
        state.coupon = null;
        return;
      }

      // Check eligible categories
      if (coupon.categories && coupon.categories.length > 0) {
        const hasEligibleItem = state.items.some(
          (item) => item.category && coupon.categories.includes(item.category)
        );
        if (!hasEligibleItem) {
          state.couponError = `This coupon is valid only for: ${coupon.categories.join(', ')}`;
          state.coupon = null;
          return;
        }
      }

      state.coupon = { code, ...coupon };
      state.couponError = null;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.couponError = null;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } =
  cartSlice.actions;
export default cartSlice.reducer;

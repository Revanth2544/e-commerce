import { TAX_RATE } from './constants';

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const calculateSubtotal = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateTax = (subtotal) => {
  return subtotal * TAX_RATE;
};

export const calculateDiscount = (subtotal, coupon) => {
  if (!coupon) return 0;
  if (coupon.type === 'percentage') {
    return (subtotal * coupon.discount) / 100;
  }
  return coupon.discount;
};

export const calculateTotal = (subtotal, tax, discount) => {
  return Math.max(0, subtotal + tax - discount);
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

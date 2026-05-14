import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import CouponInput from './CouponInput';

const OrderSummary = ({ showCoupon = true, showCheckoutButton = true, onCheckout }) => {
  const { items, subtotal, tax, discount, total, coupon } = useCart();

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST 18%)</span>
          <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount ({coupon?.code})</span>
            <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-primary-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {showCoupon && (
        <div className="mb-4">
          <CouponInput />
        </div>
      )}

      {showCheckoutButton && onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default OrderSummary;

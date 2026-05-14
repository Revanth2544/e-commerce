import { useState } from 'react';
import { useCart } from '../hooks/useCart';

const CouponInput = () => {
  const [code, setCode] = useState('');
  const { coupon, couponError, applyCode, removeCode } = useCart();

  const handleApply = (e) => {
    e.preventDefault();
    if (code.trim()) {
      applyCode(code.trim());
    }
  };

  if (coupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-700 text-sm font-medium">
            {coupon.code} applied! {coupon.type === 'percentage' ? `${coupon.discount}% off` : `₹${coupon.discount} off`}
          </span>
        </div>
        <button
          onClick={removeCode}
          className="text-green-700 hover:text-green-900 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleApply} className="flex space-x-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Apply
        </button>
      </form>
      {couponError && (
        <p className="text-red-500 text-xs mt-2">{couponError}</p>
      )}
      <p className="text-gray-400 text-xs mt-2">Try: SAVE10, FLAT500, WELCOME20, TECH15 (Laptops/Phones), FASHION10 (Clothing)</p>
    </div>
  );
};

export default CouponInput;

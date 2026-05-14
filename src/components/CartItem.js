import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';

const CartItem = ({ item }) => {
  const { removeItem, setQuantity } = useCart();

  const handleIncrease = () => {
    setQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      setQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-900 font-medium text-sm truncate">{item.name}</h3>
        <p className="text-primary-600 font-semibold mt-1">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-500 text-xs hover:text-red-700 mt-1 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;

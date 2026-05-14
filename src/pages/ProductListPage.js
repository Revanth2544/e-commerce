import { useEffect, useReducer, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

// useReducer for complex filter state management
const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };
    case 'RESET_FILTERS':
      return { search: '', category: '', priceRange: '' };
    default:
      return state;
  }
};

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);

  // Fetch categories from real API on mount
  useEffect(() => {
    productService.getCategories().then(setCategories).catch(console.error);
  }, []);

  // useReducer instead of multiple useState for complex filter logic
  const [filters, filterDispatch] = useReducer(filterReducer, {
    search: '',
    category: '',
    priceRange: '',
  });

  const loadProducts = useCallback(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (min) params.minPrice = min;
      if (max) params.maxPrice = max;
    }
    dispatch(fetchProducts(params));
  }, [dispatch, filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 mt-1">Browse our complete collection</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => filterDispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => filterDispatch({ type: 'SET_CATEGORY', payload: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          {/* Price Range */}
          <select
            value={filters.priceRange}
            onChange={(e) => filterDispatch({ type: 'SET_PRICE_RANGE', payload: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">All Prices</option>
            <option value="0-1000">Under ₹1,000</option>
            <option value="1000-5000">₹1,000 - ₹5,000</option>
            <option value="5000-15000">₹5,000 - ₹15,000</option>
            <option value="15000-50000">₹15,000 - ₹50,000</option>
            <option value="50000-">Above ₹50,000</option>
          </select>
          {(filters.search || filters.category || filters.priceRange) && (
            <button
              onClick={() => filterDispatch({ type: 'RESET_FILTERS' })}
              className="px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors md:col-span-4"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button onClick={loadProducts} className="mt-4 text-primary-600 font-medium hover:underline">
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{products.length} products found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListPage;

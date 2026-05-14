// Product service — real API calls to DummyJSON via Axios with JWT interceptors
import api from './api';

// Normalize DummyJSON product to our app's format
const normalizeProduct = (p) => ({
  id: p.id,
  name: p.title || p.name || 'Untitled',
  price: Math.round((p.price || 0) * 83), // Convert USD to INR (approx)
  category: p.category || 'general',
  image: p.thumbnail || p.image || 'https://via.placeholder.com/400',
  images: p.images || [],
  description: p.description || '',
  stock: p.stock ?? 0,
  rating: p.rating ?? 0,
  brand: p.brand || '',
  discount: p.discountPercentage || 0,
});

export const productService = {
  // GET https://dummyjson.com/products?limit=30 or /products/search?q=query or /products/category/{slug}
  async getAll(filters = {}) {
    let response;

    if (filters.search) {
      // Search endpoint: GET /products/search?q=query
      response = await api.get('/products/search', {
        params: { q: filters.search, limit: 50 },
      });
    } else if (filters.category) {
      // Category endpoint: GET /products/category/{slug}
      response = await api.get(`/products/category/${filters.category}`, {
        params: { limit: 50 },
      });
    } else {
      // All products: GET /products?limit=50
      response = await api.get('/products', {
        params: { limit: 50 },
      });
    }

    let products = response.data.products.map(normalizeProduct);

    // Client-side price filtering (DummyJSON doesn't support price params)
    if (filters.minPrice) {
      products = products.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      products = products.filter((p) => p.price <= Number(filters.maxPrice));
    }

    return products;
  },

  // GET https://dummyjson.com/products/:id
  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return normalizeProduct(response.data);
  },

  // POST https://dummyjson.com/products/add
  async create(productData) {
    const response = await api.post('/products/add', {
      title: productData.name,
      price: productData.price / 83,
      category: productData.category,
      description: productData.description,
      thumbnail: productData.image,
      stock: productData.stock,
    });
    return normalizeProduct(response.data);
  },

  // PUT https://dummyjson.com/products/:id
  async update(id, productData) {
    const response = await api.put(`/products/${id}`, {
      title: productData.name,
      price: productData.price ? productData.price / 83 : undefined,
      category: productData.category,
      description: productData.description,
      thumbnail: productData.image,
      stock: productData.stock,
    });
    return normalizeProduct(response.data);
  },

  // DELETE https://dummyjson.com/products/:id
  async delete(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // GET https://dummyjson.com/products/categories
  async getCategories() {
    const response = await api.get('/products/categories');
    return response.data.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
    }));
  },
};

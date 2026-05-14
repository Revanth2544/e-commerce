// Mock API Server - simulates backend REST API via Axios custom adapter
// All API calls go through Axios interceptors (JWT, error handling) then hit this mock handler

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 2499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    description: 'Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
    stock: 15,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 3999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    description: 'Track your fitness goals with heart rate monitoring, GPS, and 7-day battery life.',
    stock: 20,
    rating: 4.3,
  },
  {
    id: '3',
    name: 'Cotton Casual T-Shirt',
    price: 799,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors. Perfect for everyday wear.',
    stock: 50,
    rating: 4.1,
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 599,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    description: 'Double-walled insulated bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    stock: 35,
    rating: 4.7,
  },
  {
    id: '5',
    name: 'JS - The Good Parts',
    price: 450,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
    description: 'A deep dive into the best features of JavaScript by Douglas Crockford.',
    stock: 25,
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Yoga Mat Premium',
    price: 1299,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    description: 'Non-slip, eco-friendly yoga mat with alignment lines. 6mm thick for extra comfort.',
    stock: 40,
    rating: 4.4,
  },
  {
    id: '7',
    name: 'Organic Face Serum',
    price: 899,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    description: 'Natural vitamin C serum for glowing skin. Suitable for all skin types.',
    stock: 30,
    rating: 4.2,
  },
  {
    id: '8',
    name: 'Laptop Backpack',
    price: 1899,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    description: 'Water-resistant backpack with padded laptop compartment and USB charging port.',
    stock: 18,
    rating: 4.5,
  },
  {
    id: '9',
    name: 'Denim Jacket Classic',
    price: 2199,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
    description: 'Classic denim jacket with modern fit. Perfect for layering in any season.',
    stock: 12,
    rating: 4.0,
  },
  {
    id: '10',
    name: 'Ceramic Coffee Mug Set',
    price: 749,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
    description: 'Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe.',
    stock: 22,
    rating: 4.3,
  },
  {
    id: '11',
    name: 'Running Shoes Pro',
    price: 3499,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
    stock: 28,
    rating: 4.6,
  },
  {
    id: '12',
    name: 'Moisturizing Body Lotion',
    price: 549,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop',
    description: '24-hour hydration body lotion with shea butter and vitamin E.',
    stock: 45,
    rating: 4.1,
  },
];

// ─── Database helpers (localStorage as persistence layer) ───

const db = {
  getUsers() {
    return JSON.parse(localStorage.getItem('mock_users') || '[]');
  },
  saveUsers(users) {
    localStorage.setItem('mock_users', JSON.stringify(users));
  },
  getProducts() {
    const stored = localStorage.getItem('mock_products');
    if (!stored) {
      localStorage.setItem('mock_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },
  saveProducts(products) {
    localStorage.setItem('mock_products', JSON.stringify(products));
  },
};

// ─── JWT helpers ───

const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    })
  );
  const signature = btoa('mock-secret-signature');
  return `${header}.${payload}.${signature}`;
};

const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      return null; // Token expired
    }
    return payload;
  } catch {
    return null;
  }
};

// ─── Mock response builder ───

const mockResponse = (status, data) => ({
  status,
  data,
  headers: { 'content-type': 'application/json' },
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Route handlers ───

const handlers = {
  // POST /auth/login
  async 'POST /auth/login'(config) {
    await delay(600);
    const { email, password } = JSON.parse(config.data);
    const users = db.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return Promise.reject({
        response: mockResponse(401, { message: 'Invalid email or password' }),
      });
    }
    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    return mockResponse(200, { user: safeUser, token });
  },

  // POST /auth/signup
  async 'POST /auth/signup'(config) {
    await delay(600);
    const { name, email, password } = JSON.parse(config.data);
    const users = db.getUsers();
    if (users.find((u) => u.email === email)) {
      return Promise.reject({
        response: mockResponse(409, { message: 'Email already registered' }),
      });
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    db.saveUsers(users);
    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;
    return mockResponse(201, { user: safeUser, token });
  },

  // GET /auth/me
  async 'GET /auth/me'(config) {
    await delay(200);
    const user = verifyToken(config.headers?.Authorization);
    if (!user) {
      return Promise.reject({
        response: mockResponse(401, { message: 'Unauthorized' }),
      });
    }
    return mockResponse(200, { id: user.id, email: user.email, name: user.name });
  },

  // GET /products
  async 'GET /products'(config) {
    await delay(400);
    let products = db.getProducts();
    const params = config.params || {};
    if (params.category) {
      products = products.filter((p) => p.category === params.category);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      );
    }
    if (params.minPrice) {
      products = products.filter((p) => p.price >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      products = products.filter((p) => p.price <= Number(params.maxPrice));
    }
    return mockResponse(200, products);
  },

  // GET /products/:id
  async 'GET /products/:id'(config, id) {
    await delay(300);
    const products = db.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      return Promise.reject({
        response: mockResponse(404, { message: 'Product not found' }),
      });
    }
    return mockResponse(200, product);
  },

  // POST /products
  async 'POST /products'(config) {
    await delay(500);
    const user = verifyToken(config.headers?.Authorization);
    if (!user) {
      return Promise.reject({
        response: mockResponse(401, { message: 'Unauthorized' }),
      });
    }
    const productData = JSON.parse(config.data);
    const products = db.getProducts();
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      rating: 0,
    };
    products.push(newProduct);
    db.saveProducts(products);
    return mockResponse(201, newProduct);
  },

  // PUT /products/:id
  async 'PUT /products/:id'(config, id) {
    await delay(500);
    const user = verifyToken(config.headers?.Authorization);
    if (!user) {
      return Promise.reject({
        response: mockResponse(401, { message: 'Unauthorized' }),
      });
    }
    const productData = JSON.parse(config.data);
    const products = db.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.reject({
        response: mockResponse(404, { message: 'Product not found' }),
      });
    }
    products[index] = { ...products[index], ...productData };
    db.saveProducts(products);
    return mockResponse(200, products[index]);
  },

  // DELETE /products/:id
  async 'DELETE /products/:id'(config, id) {
    await delay(500);
    const user = verifyToken(config.headers?.Authorization);
    if (!user) {
      return Promise.reject({
        response: mockResponse(401, { message: 'Unauthorized' }),
      });
    }
    let products = db.getProducts();
    const exists = products.find((p) => p.id === id);
    if (!exists) {
      return Promise.reject({
        response: mockResponse(404, { message: 'Product not found' }),
      });
    }
    products = products.filter((p) => p.id !== id);
    db.saveProducts(products);
    return mockResponse(200, { message: 'Product deleted', id });
  },
};

// ─── Route matcher ───

const matchRoute = (method, url) => {
  const path = url.replace(/^https?:\/\/[^/]+\/api/, '');

  // Exact match first
  const exactKey = `${method} ${path}`;
  if (handlers[exactKey]) {
    return { handler: handlers[exactKey], params: [] };
  }

  // Parametric routes like /products/:id
  for (const key of Object.keys(handlers)) {
    const [hMethod, hPath] = key.split(' ');
    if (hMethod !== method) continue;
    const hParts = hPath.split('/');
    const pParts = path.split('/');
    if (hParts.length !== pParts.length) continue;
    const params = [];
    let match = true;
    for (let i = 0; i < hParts.length; i++) {
      if (hParts[i].startsWith(':')) {
        params.push(pParts[i]);
      } else if (hParts[i] !== pParts[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      return { handler: handlers[key], params };
    }
  }
  return null;
};

// ─── Install mock adapter onto Axios instance ───

export const setupMockServer = (axiosInstance) => {
  axiosInstance.defaults.adapter = async (config) => {
    const fullUrl = config.baseURL
      ? `${config.baseURL}${config.url}`
      : config.url;
    const method = (config.method || 'get').toUpperCase();

    const route = matchRoute(method, fullUrl);
    if (!route) {
      console.warn(`[MockServer] No handler for ${method} ${fullUrl}`);
      return Promise.reject({
        response: mockResponse(404, { message: `No mock handler for ${method} ${config.url}` }),
      });
    }

    try {
      const response = await route.handler(config, ...route.params);
      response.config = config;
      response.request = {};
      return response;
    } catch (error) {
      if (error.response) {
        error.response.config = config;
        error.response.request = {};
      }
      return Promise.reject(error);
    }
  };
};

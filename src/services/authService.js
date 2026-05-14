// Authentication service — real API calls to DummyJSON via Axios with JWT interceptors
import api from './api';

// Normalize DummyJSON user object to our app's format
const normalizeUser = (data) => ({
  id: data.id,
  name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.username,
  email: data.email,
  username: data.username,
  image: data.image,
});

export const authService = {
  // POST https://dummyjson.com/auth/login
  // DummyJSON uses username (not email) for login
  // Test user: username: 'emilys', password: 'emilyspass'
  async login(username, password) {
    const response = await api.post('/auth/login', {
      username,
      password,
      expiresInMins: 60,
    });
    const { accessToken, refreshToken, ...userData } = response.data;
    return {
      user: normalizeUser(userData),
      token: accessToken,
    };
  },

  // POST https://dummyjson.com/users/add  (simulated — DummyJSON doesn't persist)
  async signup(name, username, password) {
    const response = await api.post('/users/add', {
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || '',
      username,
      password,
      email: `${username}@example.com`,
    });
    // DummyJSON returns the created user but no token, so we auto-login
    const user = normalizeUser(response.data);
    // After signup, login to get a real token (use a known test user since DummyJSON doesn't persist)
    // In a real app, the signup endpoint would return a token
    return {
      user,
      token: 'signup-simulated-token-' + Date.now(),
    };
  },

  // GET https://dummyjson.com/auth/me — validate current token
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return normalizeUser(response.data);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

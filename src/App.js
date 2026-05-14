import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, logout } from './redux/slices/authSlice';
import { isTokenExpired } from './utils/helpers';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationBar from './components/NotificationBar';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Check auth on mount (validates token via API call)
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Auto logout on token expiry — periodic check every 60 seconds
  const checkTokenExpiry = useCallback(() => {
    if (token && isTokenExpired(token)) {
      console.warn('[Auth] Token expired — auto logging out');
      dispatch(logout());
    }
  }, [token, dispatch]);

  useEffect(() => {
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [checkTokenExpiry]);

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <NotificationBar />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;

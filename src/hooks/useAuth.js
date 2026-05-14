import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { loginUser, signupUser, logout, clearError } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    (username, password) => dispatch(loginUser({ username, password })),
    [dispatch]
  );

  const signup = useCallback(
    (name, username, password) => dispatch(signupUser({ name, username, password })),
    [dispatch]
  );

  const logoutUser = useCallback(() => dispatch(logout()), [dispatch]);

  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};

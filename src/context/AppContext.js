import { createContext, useContext, useReducer, useCallback } from 'react';

// ─── useContext: provides global app state (notification, loading) ───
// ─── useReducer: manages complex notification queue state ───

const AppContext = createContext();

// Reducer for notification queue (demonstrates useReducer for complex state)
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            message: action.payload.message,
            type: action.payload.type || 'info', // success, error, info, warning
            timestamp: Date.now(),
          },
        ],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'SET_GLOBAL_LOADING':
      return { ...state, globalLoading: action.payload };
    default:
      return state;
  }
};

const initialState = {
  notifications: [],
  globalLoading: false,
};

export const AppProvider = ({ children }) => {
  // useReducer for complex notification state management
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // useCallback to prevent re-renders in consumers
  const addNotification = useCallback((message, type = 'info') => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message, type } });
    // Auto-remove after 4 seconds
    const id = Date.now();
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, 4000);
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  const setGlobalLoading = useCallback((loading) => {
    dispatch({ type: 'SET_GLOBAL_LOADING', payload: loading });
  }, []);

  const value = {
    notifications: state.notifications,
    globalLoading: state.globalLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    setGlobalLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to consume AppContext (useContext)
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

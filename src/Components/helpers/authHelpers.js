// src/utils/authHelpers.js
import { useDispatch } from 'react-redux';
import { login, logout } from '../../redux/features/userSlice';

/**
 * Custom hook for authentication actions
 */
export const useAuthActions = () => {
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      await dispatch(login(values)).unwrap();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    // Optional: Add redirect here or handle it in components
  };

  return { login: handleLogin, logout: handleLogout };
};
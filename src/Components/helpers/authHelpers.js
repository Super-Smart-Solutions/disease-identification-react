// src/utils/authHelpers.js
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice';
import { useUserData } from '../../hooks/useUserData';

/**
 * Custom hook for authentication actions
 */
export const useAuthActions = () => {
  const { login } = useUserData()
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      await login(values).unwrap();
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
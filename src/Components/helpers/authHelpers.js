import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice';


export const useAuthActions = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return { logout: handleLogout };
};
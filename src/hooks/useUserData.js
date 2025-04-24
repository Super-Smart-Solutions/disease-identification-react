// src/hooks/useUserData.js
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../redux/features/userSlice';

export const useUserData = () => {
    const dispatch = useDispatch();
    const { user, isLoading, isError } = useSelector((state) => state.user);

    const refetchUserData = () => {
        dispatch(fetchUser());
    };



    return {
        user,
        isLoading,
        isError,
        refetchUserData,
    };
};
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setLoading, setError, logout } from '../redux/features/userSlice';
import { fetchCurrentUser, updateUserById, uploadUserAvatar as UploadUserAvatar } from '../api/userAPI';
import { loginUser } from '../api/authAPI';

import Cookies from 'js-cookie';

export const useUserData = () => {
    const dispatch = useDispatch();
    const { user, isLoading, isError, error } = useSelector((state) => state.user);

    const login = async (values) => {
        try {
            dispatch(setLoading(true));
            const loginResponse = await loginUser(values);
            const { access_token } = loginResponse;
            Cookies.set('token', access_token, {
                secure: true,
                sameSite: 'Strict',
                expires: 1,
            });
            const userResponse = await fetchCurrentUser();
            dispatch(setUser(userResponse));
            return userResponse;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(setError(errorMessage));
            throw errorMessage;
        }
    };

    const refetchUserData = async () => {
        try {
            dispatch(setLoading(true));
            const userResponse = await fetchCurrentUser();
            dispatch(setUser(userResponse));
            return userResponse;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(setError(errorMessage));
            throw errorMessage;
        }
    };

    const updateUserData = async (userId, userData) => {
        try {
            dispatch(setLoading(true));
            await updateUserById(userId, userData);
            const updatedUser = await fetchCurrentUser()
            dispatch(setUser(updatedUser));
            return updatedUser;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(setError(errorMessage));
            throw errorMessage;
        }
    };

    const uploadUserAvatar = async (avatarFile) => {
        try {
            dispatch(setLoading(true));
            const token = Cookies.get('token');
            await UploadUserAvatar(avatarFile, token);
            const updatedUser = await fetchCurrentUser()
            dispatch(setUser(updatedUser));
            return updatedUser;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(setError(errorMessage));
            throw errorMessage;
        }
    };

    const logoutUser = () => {
        dispatch(logout());
    };

    return {
        user,
        isLoading,
        isError,
        error,
        login,
        refetchUserData,
        updateUserData,
        uploadUserAvatar,
        logoutUser,
    };
};
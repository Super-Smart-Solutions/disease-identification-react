import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setUser, setLoading, setError, logout } from '../redux/features/userSlice';
import { fetchCurrentUser, updateUserById, uploadUserAvatar as UploadUserAvatarAPI } from '../api/userAPI';
import { loginUser } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';
import tokenManager from '../Components/helpers/tokenManager';

export const useUserData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user, isLoading, isError, error } = useSelector((state) => state.user);

    const login = useCallback(async (values) => {
        try {
            dispatch(setLoading(true));
            const loginResponse = await loginUser(values);
            const { access_token, refresh_token } = loginResponse;
            tokenManager.setTokens(access_token, refresh_token)
            const userResponse = await fetchCurrentUser();
            dispatch(setUser(userResponse));

            const redirectPath =
                localStorage.getItem("redirectPath")
            if (redirectPath) {
                navigate(redirectPath);
                localStorage.removeItem("redirectPath");
            } else {
                navigate("/models");
            }
            return userResponse;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(setError(errorMessage));
            throw errorMessage;
        }
    }, [dispatch, navigate]);

    const refetchUserData = useCallback(async () => {
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
    }, [dispatch]);

    const updateUserData = useCallback(async (userId, userData) => {
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
    }, [dispatch]);

    const uploadUserAvatar = useCallback(async (avatarFile) => {
        try {
            dispatch(setLoading(true));
            //const token = tokenManager.getAccessToken()
            await UploadUserAvatarAPI(avatarFile);
            const updatedUser = await fetchCurrentUser()
            dispatch(setUser(updatedUser));
            return updatedUser;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(setError(errorMessage));
            throw errorMessage;
        }
    }, [dispatch]);

    const logoutUser = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

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
import { createSlice } from '@reduxjs/toolkit';
import tokenManager from '../../Components/helpers/tokenManager';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    isError: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { accessToken, refreshToken } = action.payload;
            state.user = action.payload;
            state.isLoading = false;
            state.isError = false;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload));
            if (accessToken && refreshToken) {
                tokenManager.initialize(accessToken, refreshToken);
            }
        },
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
            state.isError = false;
            state.error = null;

            localStorage.removeItem('user');
            tokenManager.redirectToLogin();
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
        },
    },
});

export const { setUser, logout, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
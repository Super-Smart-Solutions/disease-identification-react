import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

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
            state.user = action.payload;
            state.isLoading = false;
            state.isError = false;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
            state.isError = false;
            state.error = null;
            localStorage.removeItem('user');
            Cookies.remove('token');
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
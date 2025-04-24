// src/redux/features/userSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../../api/authAPI';
import Cookies from 'js-cookie';
import { fetchCurrentUser } from '../../api/userAPI';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    isError: false,
    token: Cookies.get('token') || null,
};

export const login = createAsyncThunk(
    'user/login',
    async (values, { rejectWithValue }) => {
        try {
            const loginResponse = await loginUser(values);
            const { access_token } = loginResponse;
            Cookies.set('token', access_token, {
                secure: true,
                sameSite: 'Strict',
                expires: 1,
            });
            const userResponse = await fetchCurrentUser();
            return { user: userResponse, token: access_token };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchCurrentUser();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            Cookies.remove('token');
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            });
    },
});

export const { logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
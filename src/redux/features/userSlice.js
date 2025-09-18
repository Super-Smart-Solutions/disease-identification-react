import { createSlice } from "@reduxjs/toolkit";
import tokenManager from "../../Components/helpers/tokenManager";
import Cookies from "js-cookie";

const initialState = {
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
    isLoading: false,
    isError: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { accessToken, refreshToken } = action.payload;
            state.user = action.payload;
            state.isLoading = false;
            state.isError = false;
            state.error = null;

            // Save in cookies for 45 minutes
            Cookies.set("user", JSON.stringify(action.payload), { expires: 45 / 1440 });
            // 45 mins = 45/1440 days

            if (accessToken && refreshToken) {
                tokenManager.initialize(accessToken, refreshToken);
            }
        },
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
            state.isError = false;
            state.error = null;

            Cookies.remove("user");
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

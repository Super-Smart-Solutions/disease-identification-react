// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import soilCalculatorReducer from './features/soilCalculatorSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
    reducer: {
        soilCalculator: soilCalculatorReducer,
        user: userReducer,

    },
});
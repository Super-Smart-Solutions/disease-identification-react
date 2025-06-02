// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import soilCalculatorReducer from './features/soilCalculatorSlice';
import reviewModalReducer from './features/reviewModalSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
    reducer: {
        soilCalculator: soilCalculatorReducer,
        reviewModal: reviewModalReducer,
        user: userReducer,

    },
});
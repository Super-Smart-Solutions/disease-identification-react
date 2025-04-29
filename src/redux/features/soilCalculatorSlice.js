// src/redux/features/soilCalculatorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
};

const soilCalculatorSlice = createSlice({
    name: 'soilCalculator',
    initialState,
    reducers: {
        setSoilCalculatorOpen: (state, action) => {
            state.isOpen = action.payload;
        },
    },
});

export const { setSoilCalculatorOpen } = soilCalculatorSlice.actions;
export default soilCalculatorSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
};

const oilTestModalSlice = createSlice({
    name: "oilTestModal",
    initialState,
    reducers: {
        setOilTestModalOpen: (state, action) => {
            state.isOpen = action.payload;
        },
    },
});

export const { setOilTestModalOpen } = oilTestModalSlice.actions;
export default oilTestModalSlice.reducer;

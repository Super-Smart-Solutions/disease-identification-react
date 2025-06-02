import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
};

const reviewModalSlice = createSlice({
    name: 'reviewModal',
    initialState,
    reducers: {
        setreviewModalOpen: (state, action) => {
            state.isOpen = action.payload;
        },
    },
});

export const { setreviewModalOpen } = reviewModalSlice.actions;
export default reviewModalSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'filter',
    initialState: { searchTerm: '' },
    reducers: {
        setFilterTerm: (state, action) => {
        state.searchTerm = action.payload;
        },
        clearFilter: (state) => {
        state.searchTerm = '';
        }
    }
});

export const { setFilterTerm, clearFilter } = filterSlice.actions;
export default filterSlice.reducer;

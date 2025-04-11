// src/tests/filterSlice.test.js
import filterReducer, { setFilterTerm, clearFilter } from '../redux/filterSlice';

describe('filterSlice reducer', () => {
    it('should return the initial state', () => {
        const initialState = { searchTerm: '' };
        // The reducer should return the initial state on an unknown action.
        expect(filterReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('should handle setFilterTerm', () => {
        const state = { searchTerm: '' };
        const action = setFilterTerm('react');
        const newState = filterReducer(state, action);
        expect(newState.searchTerm).toBe('react');
    });

    it('should handle clearFilter', () => {
        const state = { searchTerm: 'some text' };
        const action = clearFilter();
        const newState = filterReducer(state, action);
        expect(newState.searchTerm).toBe('');
    });
});

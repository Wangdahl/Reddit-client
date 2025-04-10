import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        filter: filterReducer
    }
});

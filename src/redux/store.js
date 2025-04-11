import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import filterReducer from './filterSlice';
import tracksReducer from './tracksSlice';

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        filter: filterReducer,
        tracks: tracksReducer
    }
});

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch posts from Reddit API
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    // We will fetch from r/popular with .json
    const response = await fetch('http://localhost:3001/reddit/popular');
    const data = await response.json();
    // Reddit JSON structure: data.data.children is an array of posts
    // Each child has a "data" object with the post details we need.
    const posts = data.data.children.map(child => child.data);
    return posts;
});

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        items: [],       // array of post objects
        status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {
        // (We might not need non-async reducers for posts in this simple app)
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPosts.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;  // the array of posts returned from the thunk
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    }
});

export default postsSlice.reducer;

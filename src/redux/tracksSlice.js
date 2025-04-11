import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tracks: [],           // Array of tracked topic strings
  defaultTrack: '',     // The active default topic
  error: null           // Error message when, for example, the limit is reached
};

const tracksSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        addTrack: (state, action) => {
        const topic = action.payload.trim().toLowerCase();
        if (!topic) return;
        
        // If the topic already exists, update it to be the default and clear any previous error.
        if (state.tracks.includes(topic)) {
            state.defaultTrack = topic;
            state.error = null;
            localStorage.setItem('defaultTrack', state.defaultTrack);
            return;
        }
        
        // If we have reached the limit set error message.
        if (state.tracks.length >= 5) {
            state.error = "Tracked limit reached. Remove an existing topic to add a new one.";
            return;
        }
        
        // Add the new topic.
        state.tracks.push(topic);
        state.defaultTrack = topic;
        state.error = null; // Clear any previous error
        
        // Persist the updated tracked topics to localStorage.
        localStorage.setItem('trackedTopics', JSON.stringify(state.tracks));
        localStorage.setItem('defaultTrack', state.defaultTrack);
        },
        setDefaultTrack: (state, action) => {
        state.defaultTrack = action.payload;
        localStorage.setItem('defaultTrack', state.defaultTrack);
        },
        removeTrack: (state, action) => {
        state.tracks = state.tracks.filter(t => t !== action.payload);
        // If the removed topic was the default, set the default to the last topic or an empty string.
        if (state.defaultTrack === action.payload) {
            state.defaultTrack = state.tracks[state.tracks.length - 1] || '';
            localStorage.setItem('defaultTrack', state.defaultTrack);
        }
        localStorage.setItem('trackedTopics', JSON.stringify(state.tracks));
        // Clear error so that a user can add a new topic if needed.
        state.error = null;
        },
        loadTracks: (state) => {
        const storedTracks = localStorage.getItem('trackedTopics');
        const storedDefault = localStorage.getItem('defaultTrack');
        if (storedTracks) {
            state.tracks = JSON.parse(storedTracks);
        }
        if (storedDefault) {
            state.defaultTrack = storedDefault;
        }
        },
        clearError: (state) => {
        state.error = null;
        }
    }
    });

export const { addTrack, setDefaultTrack, removeTrack, loadTracks, clearError } = tracksSlice.actions;
export default tracksSlice.reducer;

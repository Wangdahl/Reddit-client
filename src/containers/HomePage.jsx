// src/containers/HomePage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postsSlice';
import { loadTracks } from '../redux/tracksSlice';
import PostCard from '../components/PostCard';
import Sidebar from '../components/SideBar';

export default function HomePage() {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts.items);
    const postsStatus = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);
    const defaultTrack = useSelector(state => state.tracks.defaultTrack);

    useEffect(() => {
        dispatch(loadTracks());
    }, [dispatch]);

    useEffect(() => {
        // Fetch posts: if defaultTrack exists, perform a search; if not, fetch popular posts.
        dispatch(fetchPosts(defaultTrack));
    }, [dispatch, defaultTrack]);

    // Listen for refresh event from the Sidebar.
    useEffect(() => {
        const refreshHandler = () => {
        dispatch(fetchPosts(defaultTrack));
        };
        window.addEventListener('refreshTrack', refreshHandler);
        return () => window.removeEventListener('refreshTrack', refreshHandler);
    }, [dispatch, defaultTrack]);

    return (
        <div className="home-container">
        <Sidebar />
        <main className="home-page">
            {postsStatus === 'loading' && <p>Loading posts...</p>}
            {postsStatus === 'failed' && <p>Error: {error}</p>}
            {postsStatus === 'succeeded' && posts.length === 0 && <p>No results found for "{defaultTrack}"</p>}
            {postsStatus === 'succeeded' && posts.map(post => (
            <PostCard key={post.id} post={post} />
            ))}
        </main>
        </div>
    );
}

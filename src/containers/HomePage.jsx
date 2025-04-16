
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postsSlice';
import { loadTracks } from '../redux/tracksSlice';
import PostCard from '../components/PostCard';
import Sidebar from '../components/SideBar';
import '../assets/styles/HomePage.css'

export default function HomePage() {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.items);
    const postsStatus = useSelector((state) => state.posts.status);
    const error = useSelector((state) => state.posts.error);
    const defaultTrack = useSelector((state) => state.tracks.defaultTrack);

    // Local state flag to indicate that tracks have been loaded
    const [tracksLoaded, setTracksLoaded] = useState(false);

    // Load tracks on mount.
    useEffect(() => {
        dispatch(loadTracks());
        setTracksLoaded(true);
    }, [dispatch]);

    // Fetch posts once tracks have been loaded
    useEffect(() => {
        if (tracksLoaded) {
        // If a default track exists, fetch using that query;
        // otherwise, fetch popular posts.
        dispatch(fetchPosts(defaultTrack || ''));
        }
    }, [dispatch, defaultTrack, tracksLoaded]);

    // Listen for refresh event from Sidebar.
    useEffect(() => {
        const refreshHandler = () => {
        if (tracksLoaded) {
            dispatch(fetchPosts(defaultTrack || ''));
        }
        };
        window.addEventListener('refreshTrack', refreshHandler);
        return () => window.removeEventListener('refreshTrack', refreshHandler);
    }, [dispatch, defaultTrack, tracksLoaded]);

    return (
        <div className="home-container">
        <Sidebar />
        <main className="home-page">
            {postsStatus === 'loading' && <p>Loading posts...</p>}
            {postsStatus === 'failed' && <p>Error: {error}</p>}
            {postsStatus === 'succeeded' && posts.length === 0 && (
            <p>No results found for "{defaultTrack}"</p>
            )}
            {postsStatus === 'succeeded' &&
            posts.map((post) => <PostCard key={post.id} post={post} />)}
        </main>
        </div>
    );
}

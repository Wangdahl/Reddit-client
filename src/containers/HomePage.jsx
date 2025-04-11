import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/postsSlice';
import TopicInput from '../components/TopicInput';
import PostCard from '../components/PostCard';

function HomePage() {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts.items);
    const postsStatus = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);
    const searchTerm = useSelector(state => state.filter.searchTerm);

    useEffect(() => {
        if (postsStatus === 'idle') {
        // Fetch posts when component mounts (only if not already loading/loaded)
        dispatch(fetchPosts());
        }
    }, [postsStatus, dispatch]);

    // Filter posts based on search term (case-insensitive)
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="home-page">
        {/* Topic Input for filtering */}
        <TopicInput />

        {/* Status handling */}
        {postsStatus === 'loading' && <p>Loading posts...</p>}
        {postsStatus === 'failed' && <p className="error">Error: {error}</p>}

        {/* Posts list */}
        {postsStatus === 'succeeded' && (
            <div className="posts-list">
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
                ))
            ) : (
                <p>No posts found {searchTerm && <>for "{searchTerm}"</>}.</p>
            )}
            </div>
        )}
        </main>
    );
}

export default HomePage;

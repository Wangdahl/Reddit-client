import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PostDetail() {
    const [searchParams] = useSearchParams();
    const permalink = searchParams.get('permalink');
    const navigate = useNavigate();
    const [postData, setPostData] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchPostDetail() {
        try {
            // Use your backend proxy endpoint for post details.
            const res = await fetch(`http://localhost:3001/reddit/post?permalink=${encodeURIComponent(permalink)}`);
            if (!res.ok) {
            throw new Error('Failed to fetch post details');
            }
            const data = await res.json();
            // Reddit returns an array: first element contains the post data, second the comments.
            const post = data[0].data.children[0].data;
            const comms = data[1].data.children
            .filter(child => child.kind === 't1') // Ensure only comments are included
            .map(child => child.data);
            setPostData(post);
            setComments(comms);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
        }
        if (permalink) {
        fetchPostDetail();
        } else {
        setError('Missing post permalink');
        setLoading(false);
        }
    }, [permalink]);

    if (loading) return <p>Loading post details...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="post-detail">
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
            ← Back to Posts
        </button>
        <h2>{postData.title}</h2>
        <p>Posted by u/{postData.author}</p>
        <p>{postData.selftext}</p>
        {postData.url && postData.url.match(/\.(jpeg|jpg|png|gif)$/) && (
            <img src={postData.url} alt="Post visual" style={{ maxWidth: '100%' }} />
        )}
        <h3>Comments</h3>
        {comments.length ? (
            <ul>
            {comments.map(comment => (
                <li key={comment.id}>
                <strong>{comment.author}</strong>: {comment.body}
                </li>
            ))}
            </ul>
        ) : (
            <p>No comments available.</p>
        )}
        </div>
    );
}

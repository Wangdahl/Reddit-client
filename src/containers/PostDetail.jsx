import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../assets/styles/PostDetail.css'

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

    function decodeHtmlEntities(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function renderPostContent(postData) {
        const content = [];
        // Render rich HTML content for self posts.
        if (postData.selftext_html) {
            const decodedHtml = decodeHtmlEntities(postData.selftext_html);
            content.push(
                <div key="html" className="post-content-html">
                    <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
                </div>
            );
        
        }
        // Render video if available.
        if (postData.is_video && postData.media && postData.media.reddit_video) {
            content.push(
                <div key="video" className="post-video-container">
                    <video controls className="post-video">
                        <source src={postData.media.reddit_video.fallback_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }
        // Render image if post_hint is "image" or if URL ends with an image extension.
        if (postData.post_hint === 'image' || (postData.url && postData.url.match(/\.(jpeg|jpg|png|gif)$/))) {
            content.push(
                <div key="image" className="post-image-container">
                    <img src={postData.url} alt="Post visual" className="post-image" />
                </div>
            );
        }
        // Render a clickable link for link posts.
        if (postData.post_hint === 'link') {
            content.push(
                <div key="link" className="post-link-container">
                    <p className="post-link">
                        <a href={postData.url} target="_blank" rel="noopener noreferrer">
                        {postData.url}
                        </a>
                    </p>
                </div>
            );
        }
        // Fallback: If no other content exists, show the plain selftext in a container.
        if (content.length === 0) {
            content.push(
                <div key="fallback" className="post-text-container">
                    <p className="post-text">{postData.selftext}</p>
                </div>
            );
        }
        return <div className="post-content-wrapper">{content}</div>;
    }

    function renderComment(comment) {
        return (
            <li key={comment.id}>
                <div className='comment'>
                    <strong>{comment.author}</strong>
                    <p>{comment.body}</p>
                    <span className="votes">
                        {comment.ups >= 0 ? (
                            <>
                            <i className="fa-solid fa-arrow-up"></i> {comment.ups}
                            </>
                        ) : (
                            <>
                            <i className="fa-solid fa-arrow-down"></i> {comment.ups}
                            </>
                        )}
                    </span>
                </div>
                {comment.replies && comment.replies.data && comment.replies.data.children.length > 0 && (
                    <ul className='nested-comments'>
                        {comment.replies.data.children
                            .filter(child => child.kind == 't1')
                            .map(child => renderComment(child.data))}
                    </ul>
                )}
            </li>
        );
    }

    if (loading) return <p>Loading post details...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="post-detail">
            <h2>{postData.title}</h2>
            <p className='poster'>Posted by u/{postData.author}</p>

            {renderPostContent(postData)}
            <button 
                onClick={() => {
                    if (window.history.length > 2) {
                        navigate(-1);
                    } else {
                        navigate('/');
                    }
                }}
                className='back-btn'>
                    <i className="fa-solid fa-arrow-left-long"></i>
                    Back to Posts
            </button>
            <h3>Comments</h3>
            {comments.length ? (
                <ul>
                {comments.map(comment => renderComment(comment))}
                </ul>
            ) : (
                <p>No comments available.</p>
            )}
        </div>
    );
}

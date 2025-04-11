import '../assets/styles/PostCard.css';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
    // Destructure the fields we want to use from the post object
    const {
        title,
        author,
        subreddit_name_prefixed,
        ups,
        num_comments,
        permalink,
        url,
        thumbnail
    } = post;

    // Create a full link to Reddit comments (permalink is relative to reddit.com)
    const redditLink = `https://www.reddit.com${permalink}`;

    return (
        <article className="post-card">
        {/* Title as a link to the Reddit post */}
        <h3 className="post-title">
            <Link to={`/post?permalink=${encodeURIComponent(permalink)}`}>
                {title}
            </Link>
        </h3>

        {/* Metadata section */}
        <div className="post-meta">
            <span>{subreddit_name_prefixed}</span>{" "}
            <span>• Posted by u/{author}</span>{" "}
            <span>• 🔺 {ups}</span>{" "}
            <span>• 💬 {num_comments}</span>
        </div>

        {/* Thumbnail image (if available and not the default 'self' or 'nsfw' placeholders) */}
        {thumbnail && thumbnail.startsWith("http") && (
            <img src={thumbnail} alt="thumbnail" className="post-thumb" />
        )}
        </article>
    );
}

export default PostCard;

import { render, screen } from '@testing-library/react';
import PostCard from '../components/PostCard';

const samplePost = {
    id: 'abc123',
    title: 'Hello World',
    author: 'testuser',
    subreddit_name_prefixed: 'r/testing',
    ups: 42,
    num_comments: 10,
    permalink: '/r/testing/comments/abc123/hello_world/',
    thumbnail: 'https://via.placeholder.com/100'
};

describe('PostCard component', () => {
    test('renders post title and meta information', () => {
        render(<PostCard post={samplePost} />);
        
        // Check that the post title is rendered and appears in the link text.
        expect(screen.getByRole('link', { name: /hello world/i })).toBeInTheDocument();

        // Check meta information: subreddit, author, upvotes, and comment count.
        expect(screen.getByText(/r\/testing/i)).toBeInTheDocument();
        expect(screen.getByText(/testuser/i)).toBeInTheDocument();
        expect(
            screen.getByText((content, element) => {
                const normalized = content.replace(/\s+/g, ' ').trim();
                return normalized.includes("🔺 42");
            })
        ).toBeInTheDocument();          
        expect(
            screen.getByText((content, element) => {
                const normalized = content.replace(/\s+/g, ' ').trim();
                return normalized.includes("💬 10");
            })
        ).toBeInTheDocument();          
    });

    test('renders a valid thumbnail image', () => {
        render(<PostCard post={samplePost} />);
        
        const img = screen.getByRole('img', { name: /thumbnail/i });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', samplePost.thumbnail);
    });

    test('does not render an invalid thumbnail', () => {
        const postWithoutThumb = { ...samplePost, thumbnail: 'self' };
        render(<PostCard post={postWithoutThumb} />);

        // The invalid thumbnail 'self' should not create an image element.
        const img = screen.queryByRole('img', { name: /thumbnail/i });
        expect(img).toBeNull();
    });
});

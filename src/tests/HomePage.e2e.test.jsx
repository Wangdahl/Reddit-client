import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../containers/HomePage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../redux/postsSlice';
import filterReducer from '../redux/filterSlice';

// Dummy data
const dummyPosts = {
    items: [
        {
        id: 'abc123',
        title: 'Post About Reddit',
        author: 'user1',
        subreddit_name_prefixed: 'r/test',
        ups: 42,
        num_comments: 10,
        permalink: '/r/test/comments/abc123/post_about_reddit/',
        thumbnail: 'https://via.placeholder.com/100'
        },
        {
        id: 'def456',
        title: 'Another Post',
        author: 'user2',
        subreddit_name_prefixed: 'r/test',
        ups: 100,
        num_comments: 50,
        permalink: '/r/test/comments/def456/another_post/',
        thumbnail: 'https://via.placeholder.com/100'
        }
    ],
    status: 'succeeded',
    error: null
};

const dummyFilter = { searchTerm: '' };

// Create a test store with preloaded dummy data.
const store = configureStore({
    reducer: { posts: postsReducer, filter: filterReducer },
    preloadedState: { posts: dummyPosts, filter: dummyFilter }
});

test('HomePage filters posts based on search term', async () => {
    render(
        <Provider store={store}>
        <HomePage />
        </Provider>
    );

    // Expect that there are articles
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBe(dummyPosts.items.length);

    // Find the topic input
    const input = screen.getByPlaceholderText(/track a topic/i);

    // Simulate user typing a search term that matches one of the posts.
    await userEvent.type(input, 'reddit');

    // Wait for the UI to update after the filter is applied.
    await waitFor(() => {
        const filteredArticles = screen.queryAllByRole('article');
        expect(filteredArticles.length).toBeLessThan(articles.length);
        filteredArticles.forEach((article) => {
        // Ensure that each filtered article's text includes "reddit"
        expect(article.textContent.toLowerCase()).toContain('reddit');
        });
    });

    // Assume there is a clear button with an accessible name "Clear"
    const clearBtn = screen.getByRole('button', { name: /clear/i });
    userEvent.click(clearBtn);

    // After clearing the search, all posts should reappear.
    await waitFor(() => {
        const restoredArticles = screen.getAllByRole('article');
        expect(restoredArticles.length).toEqual(articles.length);
    });
});

/* eslint-env node */
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors({ origin: '*' }));

// Global token storage for app-only (client credentials) access.
let accessToken = null;
let tokenExpiresAt = null; // Timestamp in ms when the token expires

// Function to request a new access token from Reddit.
async function getAccessToken() {
  const creds = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'redtracker-dev:v1.0 (by /u/Tricky-Wish-8189)'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('❌ Failed to get access token:', data);
    return null;
  }
  // Calculate expiry time: Reddit tokens typically expire in 3600 seconds.
  const now = Date.now();
  tokenExpiresAt = now + data.expires_in * 1000;
  console.log('✅ Access token obtained, expires in:', data.expires_in, 'seconds');
  return data.access_token;
}

// Middleware to refresh the token if needed.
app.use(async (req, res, next) => {
  const now = Date.now();
  if (!accessToken || (tokenExpiresAt && now >= tokenExpiresAt)) {
    accessToken = await getAccessToken();
  }
  next();
});

// Endpoint 1: Fetch popular posts (default view)
app.get('/reddit/popular', async (req, res) => {
  try {
    const redditResponse = await fetch('https://oauth.reddit.com/r/popular.json?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'redtracker-dev:v1.0 (by /u/Tricky-Wish-8189)'
      }
    });
    const data = await redditResponse.json();
    if (!redditResponse.ok) {
      console.error('🔒 Reddit API error (popular):', data);
      return res.status(redditResponse.status).json({ error: data });
    }
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching popular posts:', error);
    res.status(500).json({ error: 'Error fetching popular posts from Reddit' });
  }
});

// Endpoint 2: Search posts based on a query (track-a-topic)
app.get('/reddit/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }
  try {
    const redditResponse = await fetch(`https://oauth.reddit.com/search.json?limit=50&q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'redtracker-dev:v1.0 (by /u/Tricky-Wish-8189)'
      }
    });
    const data = await redditResponse.json();
    if (!redditResponse.ok) {
      console.error('Reddit API error (search):', data);
      return res.status(redditResponse.status).json({ error: data });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching search results from Reddit:', error);
    res.status(500).json({ error: 'Error fetching search results from Reddit' });
  }
});

// Endpoint 3: Fetch full post details
// This endpoint expects a query parameter "permalink" which is the Reddit permalink for the post
app.get('/reddit/post', async (req, res) => {
  const { permalink } = req.query;
  if (!permalink) {
    return res.status(400).json({ error: 'Missing permalink query parameter' });
  }
  try {
    const redditResponse = await fetch(`https://oauth.reddit.com${permalink}.json?limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'User-Agent': 'redtracker-dev:v1.0 (by /u/Tricky-Wish-8189)'
      }
    });
    const data = await redditResponse.json();
    if (!redditResponse.ok) {
      console.error('Reddit API error (post detail):', data);
      return res.status(redditResponse.status).json({ error: data });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching post details from Reddit:', error);
    res.status(500).json({ error: 'Error fetching post details from Reddit' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  accessToken = await getAccessToken();
});

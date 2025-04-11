/* eslint-env node */
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors({ origin: '*' }));

let accessToken = null;
let tokenExpiresAt = null;

// Get a new access token from Reddit using client credentials
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
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('❌ Failed to get token:', data);
    return null;
  }

  // Calculate expiry (in ms)
  const now = Date.now();
  const expiresInMs = data.expires_in * 1000; // Reddit gives it in seconds
  tokenExpiresAt = now + expiresInMs;

  console.log('New access token fetched, expires in:', data.expires_in, 's');

  return data.access_token;
}


// ✅ STEP 2: Proxy endpoint to Reddit (using token)
app.get('/reddit/popular', async (req, res) => {
  const now = Date.now();

  if (!accessToken || !tokenExpiresAt || now >= tokenExpiresAt) {
    console.log(' Token expired or missing, refreshing...');
    accessToken = await getAccessToken();

    if (!accessToken) {
      return res.status(500).json({ error: 'Failed to refresh token' });
    }
  }

  // When token is valid we fetch posts
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
      return res.status(redditResponse.status).json({ error: data });
    }

    res.json(data);
  } catch (err) {
    console.error('❌ Reddit fetch failed:', err);
    res.status(500).json({ error: 'Error fetching Reddit data' });
  }
});


# Reddit Client

A custom Reddit-inspired client built as a portfolio project. This application displays posts from Reddit, allows users to track topics with search functionality, and offers an in-app post detail view with comments—all while using modern web technologies and best practices.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features

- **Default View:**  
  Displays the top 50 popular posts from Reddit on initial load.

- **Track-a-Topic:**  
  - Users can enter keywords to “track” a topic.
  - Uses Reddit’s search API to fetch posts for tracked topics.
  - Supports up to 5 tracked topics.
  - Most recent tracked topic becomes the default view.
  - Topics persist between sessions via `localStorage`.

- **Sidebar:**  
  - Lists all tracked topics.
  - Contains a reusable `TopicInput` component to add topics.
  - Options to select, remove, or refresh topics.

- **In-App Post Detail View:**  
  - Uses React Router for internal navigation.
  - Fetches full post content and comments.
  - “Back to Posts” button for easy navigation.

- **Backend Proxy:**  
  - Node/Express server proxies Reddit API requests using OAuth2 (client credentials flow).
  - Endpoints for popular posts, search, and post details.
  - Handles token management and refreshing.

- **Responsive UI & Dark Theme:**  
  - Dark theme with basic CSS.
  - Modern, responsive layout for desktop and mobile.

---

## Technologies

- **Frontend:**  
  - React (via Vite)  
  - Redux Toolkit  
  - React Router v6  
  - CSS (custom dark theme)

- **Backend:**  
  - Node.js  
  - Express  
  - OAuth2 (Client Credentials flow)

- **Testing:**  
  - Vitest  
  - React Testing Library  
  - jsdom

---

## Project Structure

/reddit-client  
├── /public               # Static assets  
├── /src  
│   ├── /assets           # Images, fonts, CSS  
│   ├── /components       # Reusable UI components  
│   │   ├── Header.jsx  
│   │   ├── Footer.jsx  
│   │   ├── PostCard.jsx  
│   │   ├── TopicInput.jsx  
│   │   └── Sidebar.jsx  
│   ├── /containers       # Page-level components  
│   │   ├── HomePage.jsx  
│   │   └── PostDetail.jsx  
│   ├── /redux            # Redux slices and store config  
│   │   ├── postsSlice.js  
│   │   ├── filterSlice.js  
│   │   └── tracksSlice.js  
│   ├── /tests            # Component and slice tests  
│   ├── App.jsx           # Main app with routes  
│   └── main.jsx          # React entry point  
├── /server               # Express backend  
│   ├── server.js  
│   └── .env              # Reddit OAuth credentials  
├── package.json  
├── .gitignore  
├── vite.config.js  
└── README.md             # This file  

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/reddit-client.git
cd reddit-client
```

### 2. Install Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

Create a `.env` file inside `/server` with the following:

```
REDDIT_CLIENT_ID=yourKeyHere
REDDIT_CLIENT_SECRET=yourKeyHere
```

### 3. Run Development Servers

**Frontend (Vite):**

```bash
npm run dev
```

**Backend (Node):**

Open another terminal and run:

```bash
node server/server.js
```

---

## Usage

### Viewing Posts

When the app loads, it displays the top 50 popular posts by default.

### Tracking Topics

- Use the `TopicInput` in the Sidebar to add a new tracked topic.
- Tracked topics are stored in Redux and localStorage.
- The most recently added topic becomes the default view.
- HomePage fetches results based on the active topic.

### Managing Tracked Topics

- Sidebar displays all tracked topics (up to 5).
- Click a topic to activate it.
- Use the “Remove” button to delete a tracked topic.
- Use the “Refresh” button to re-fetch the post list.

### Post Detail View

- Click on any post title to open the detailed view.
- The app fetches post content and comments via proxy.
- Use “Back to Posts” to return to the main feed.

---

## Testing

The project uses **Vitest** and **React Testing Library**.

### Run Tests

```bash
npm run test
```

### Test Coverage

- **Redux Slices:**  
  Unit tests confirm state changes for post filtering and topic tracking.

- **React Components:**  
  Components like `PostCard`, `TopicInput`, and `Sidebar` are tested for rendering and interactivity.

- **End-to-End (E2E):**  
  Example scenario tests simulate user flows on `HomePage`.

---

## Deployment

### Frontend

- Built with Vite as a static site.
- It can be deployed to platforms like Netlify or Vercel.

### Backend

- The Node/Express proxy should be deployed as a Node.js server.
- Update the API endpoint URLs in the frontend if necessary once the backend is deployed.

---

## Future Improvements

- **User-Based Authentication:** Extend the app to allow individual users to sign in with Reddit using the full Authorization Code flow, so actions like voting or commenting can be enabled.  
- **Performance Optimization:** Optimize API call management and consider a more robust token refresh strategy if switching to permanent tokens.
- **Error Handling & Caching:** Implement advanced error boundaries and caching strategies for API requests on the backend.

---

## License

MIT

---

## Acknowledgements

This project was inspired by a Codecademy portfolio assignment and expanded to include production-style features using modern React and Redux practices.

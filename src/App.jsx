import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './containers/HomePage';
import PostDetail from './containers/PostDetail';
import './assets/styles/App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Header onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
      <Routes>
        <Route path="/" element={<HomePage isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />} />
        <Route path="/post" element={<PostDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

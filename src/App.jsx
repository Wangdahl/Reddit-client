import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './containers/HomePage';
import PostDetail from './containers/PostDetail';
import './assets/styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post" element={<PostDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

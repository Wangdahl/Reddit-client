import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './containers/HomePage';
import './assets/styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;

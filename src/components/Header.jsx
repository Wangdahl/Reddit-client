import '../assets/styles/Header.css';
import { useLocation } from 'react-router-dom';

function Header({ onToggleSidebar }) {
    const location = useLocation();
    const isHome = location.pathname === '/';
    
    return (
        <header className="header">
            <img className='header-logo' src="..\..\src\assets\images\reddit-tracker-icon.png" alt="" />
            <h1 className='front-h1'>Reddit Tracker 1.0</h1>
            {isHome && (
                <button className='mobile-menu-toggle' onClick={onToggleSidebar}>
                    ☰
                </button>
            )}
        </header>
    );
}


export default Header;
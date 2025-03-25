import './HeaderNav.scss';

// react + Link
import { Link } from 'react-router-dom';
import {useState} from 'react';

// images
import searchImg from '../../../assets/search-icon.svg';

function HeaderNav() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    function toggleMenu() {
        setIsMenuOpen(prev => !prev)
    }

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <nav className="header-nav">
            <div className="header-top">
                <div className="logo">
                    <h1 className="logo-title">GII</h1>
                </div>

                <button className={`burger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <ul className={`navbar ${isMenuOpen ? 'open' : ''}`}>
                <li className="nav-item" onClick={closeMenu}><Link to='/'>Home</Link></li>
                <li className="nav-item" onClick={closeMenu}><Link to='/movies'>Movies</Link></li>
                <li className="nav-item" onClick={closeMenu}><Link to='/tvshows'>TV Shows</Link></li>
                <li className="nav-item" onClick={closeMenu}><Link to='/saved'>Saved</Link></li>
            </ul>

            <form className='nav-form'>
                <input placeholder='Enter title...' type="text" />
                <button className='search-btn'>
                    <img src={searchImg} alt="search" />
                </button>
            </form>
        </nav>
    )
}

export default HeaderNav;
import './HeaderNav.scss';

import {useState} from 'react';

// images
import searchImg from '../../../assets/search-icon.svg';

function HeaderNav() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    function toggleMenu() {
        setIsMenuOpen(prev => !prev)
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
                <li className="nav-item">Home</li>
                <li className="nav-item">Movies</li>
                <li className="nav-item">TV Shows</li>
                <li className="nav-item">Saved</li>
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
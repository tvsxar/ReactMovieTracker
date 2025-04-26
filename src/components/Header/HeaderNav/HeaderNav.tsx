import './HeaderNav.scss';

// react + Link
import { Link, useNavigate } from 'react-router-dom';
import {useState, useEffect, useContext} from 'react';
import { MovieContext } from '../../MovieContext/MovieContext'; 

// types
import type { Movie } from '../../MovieContext/MovieContext';

// images
import searchImg from '../../../assets/search-icon.svg';

function HeaderNav() {
    const { fetchContentByInput } = useContext(MovieContext) ?? { fetchContentByInput: async () => [] };

    // navigation menu state
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // suggestions list
    const [suggestions, setSuggestions] = useState<Movie[]>([]);
    const [query, setQuery] = useState<string>('');
    const navigate = useNavigate();

    // search page
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (query.trim() !== '') {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    }

    // toggle menu open/close
    function toggleMenu() {
        setIsMenuOpen(prev => !prev)
    }

    function closeMenu() {
        setIsMenuOpen(false);
        setQuery('');
    }

    // hooks
    useEffect(() => {
        async function searchByQuery() {
            const list = await fetchContentByInput(query);
            setSuggestions(list.slice(0, 5));
        }

        const delay = setTimeout(searchByQuery, 300);
        return () => clearTimeout(delay);
    }, [query])

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

            <div className="nav-form-wrapper">
                <form className='nav-form' onSubmit={handleSubmit}>
                    <input value={query}  placeholder='Enter title...' type="text" onChange={(e) => setQuery(e.target.value)} />
                    <button type='submit' className='search-btn'>
                        <img src={searchImg} alt="search" />
                    </button>
                </form>

                {suggestions.length > 0 && (
                    <ul className="suggestions-dropdown">
                        {suggestions.map(item => (
                            <li key={item.id} onClick={closeMenu}>
                                <Link to={`/info/${item.media_type}/${item.id}`} className='suggestion-item' onClick={() => setQuery('')}>
                                    <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} loading='lazy' alt={item.title || item.name} />
                                    <div className="item-info">
                                        <span>{item.title || item.name}</span>
                                        <span className="year">
                                            {(item.release_date || item.first_air_date || '').slice(0, 4)}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    )
}

export default HeaderNav;
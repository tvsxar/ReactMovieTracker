import './Header.scss';

// react + router
import { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

// components
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderContent from './HeaderContent/HeaderContent';

function Header() {
    const [background, setBackground] = useState<string | null>('');

    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

    const location = useLocation();
    const isCardInfo = matchPath("/info/:type/:id", location.pathname);

    useEffect(() => {
        if (isCardInfo) {
            setBackground(null);
        }

    }, [isCardInfo])

    return (
        <header className={`header ${isCardInfo ? 'header-card' : ''}`} style={{backgroundImage: background ? `url(${IMAGE_BASE_URL}${background})` : 'none'}}>
            <div className="container">
                <HeaderNav />
                {!isCardInfo && <HeaderContent setBackground={setBackground} />}
            </div>
        </header>
    )
}

export default Header;
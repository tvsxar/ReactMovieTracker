import './Header.scss';

import { useState } from 'react';

// components
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderContent from './HeaderContent/HeaderContent';

function Header() {
    const [background, setBackground] = useState<string | null>('');

    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

    return (
        <header className="header" style={{backgroundImage: background ? `url(${IMAGE_BASE_URL}${background})` : 'none'}}>
            <div className="container">
                <HeaderNav />
                <HeaderContent setBackground={setBackground} />
            </div>
        </header>
    )
}

export default Header;
import './Card.scss';

// react + context + chroma + router
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { MovieContext } from '../MovieContext/MovieContext';

// images
import flame from '../../assets/flame.svg';
import win from '../../assets/win.svg';

// types
interface CardProps {
    movie?: {
        id: number,
        title: string,
        name?: string,
        poster_path: string,
        backdrop_path?: string,
        genre_ids: number[],
        overview: string,
        vote_average: number,
    };
    isMini?: boolean;
    info?: string;
    type?: 'movie' | 'tv';
}

function Card({movie, isMini, info, type} : CardProps) {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { allGenres } = useContext(MovieContext) ?? { allGenres: [] };
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

    if (!movie) {
        return;
    } 

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    function getGenre(genre_ids : number[]) {
        return allGenres
        .filter(genre => genre_ids.includes(genre.id))
        .map(genre => genre.name)
        .join(', ')
    }

    return (
        <Link to={`/info/${type?.toLowerCase()}/${movie.id}`} className={`card ${isMini ? 'mini' : ''}`} style={{backgroundImage: `url(${IMAGE_BASE_URL}${isMobile || isMini ? movie.poster_path : movie.backdrop_path})`}}>
            {info && <div className="card-info">
                {info}
            <img src={info === 'Trending' ? flame : win} alt="rating" />
            </div>}
            <div className="card-title-container">
                <div className="card-title">{movie.name || movie.title}</div>

                <div className="card-genre">{getGenre(movie.genre_ids)}</div>
            </div>
        </Link>
    )
}

export default Card;
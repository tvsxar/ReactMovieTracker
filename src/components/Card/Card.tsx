import './Card.scss';

// react + context + chroma
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
    type?: string;
}

function Card({movie, isMini, type} : CardProps) {
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
        <div className={`card ${isMini ? 'mini' : ''}`} style={{backgroundImage: `url(${IMAGE_BASE_URL}${isMobile || isMini ? movie.poster_path : movie.backdrop_path})`}}>
            {type && <div className="card-type">
                {type}
            <img src={type === 'Trending' ? flame : win} alt="rating" />
            </div>}
            <div className="card-title-container">
                <div className="card-title">{movie.name || movie.title}</div>

                <div className="card-genre">{getGenre(movie.genre_ids)}</div>
            </div>
        </div>
    )
}

export default Card;
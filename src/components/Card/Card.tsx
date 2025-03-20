import './Card.scss';

// react + context
import { useContext, useState, useEffect } from "react";
import { MovieContext } from '../MovieContext/MovieContext'; 

// types
interface CardProps {
    movie: {
        id: number,
        title: string,
        name?: string,
        poster_path: string,
        backdrop_path?: string,
        genre_ids: number[],
        overview: string,
        vote_average: number,
    };
}

function Card({movie} : CardProps) {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { genres } = useContext(MovieContext) ?? { genres: [] };
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    function getGenre(genre_ids : number[]) {
        return genres
        .filter(genre => genre_ids.includes(genre.id))
        .map(genre => genre.name)
        .join(', ')
    }

    return (
        <div className="card" style={{backgroundImage: `url(${IMAGE_BASE_URL}${isMobile ? movie.poster_path : movie.backdrop_path})`}}>
            <div className="card-title-container">
                <div className="card-title">{movie.title}</div>

                <div className="card-genre">{getGenre(movie.genre_ids)}</div>
            </div>
        </div>
    )
}

export default Card;
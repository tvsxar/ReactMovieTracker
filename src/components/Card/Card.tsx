import './Card.scss';

// react + context
import { useContext } from "react";
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
    const { genres } = useContext(MovieContext) ?? { genres: [] };
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

    function getGenre(genre_ids : number[]) {
        return genres
        .filter(genre => genre_ids.includes(genre.id))
        .map(genre => genre.name)
        .join(', ')
    }

    return (
        <div className="card" style={{backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`}}>
            <div className="card-title-container">
                <div className="card-title">{movie.title}</div>

                <div className="card-genre">{getGenre(movie.genre_ids)}</div>
            </div>
        </div>
    )
}

export default Card;
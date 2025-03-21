import './CardList.scss';

// components
import Card from '../../Card/Card';

// react + context
import { useContext, useState, useEffect } from "react";
import { MovieContext } from '../../MovieContext/MovieContext';

// types
import type { Movie } from '../../MovieContext/MovieContext';
interface CardListProps {
    contentType?: 'Movies' | 'Series';
}

function CardList({contentType} : CardListProps) {
    const { movies, series } = useContext(MovieContext) ?? { movies: [], series: [] };
    const [randomMovies, setRandomMovies] = useState<Movie[]>([]);
    const [slideAmount, setSlideAmount] = useState<number>(6);

    // responsive
    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth <= 768) {
                setSlideAmount(4);
            } else if(window.innerWidth <= 1024) {
                setSlideAmount(5);
            } else {
                setSlideAmount(6);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])
    
    // random movies
    useEffect(() => {
        const CardListContentType = contentType === 'Movies' ? movies : series;

        const shuffled = [...CardListContentType]
            .sort(() => 0.5 - Math.random()) // mix
            .filter(movie => movie.poster_path) // only with bg
            .slice(0, slideAmount); // 6 random
        
        setRandomMovies(shuffled);

    }, [movies, series, slideAmount]);

    return (
        <div className="card-list">
            <div className="card-list-text">
                <h2 className="card-list-title">{contentType}</h2>

                <p className="card-title-link">See all</p>
            </div>

            <div className="cards">
                {randomMovies.map((movie) => (
                    <Card key={movie.id} isMini={true} movie={movie} />
                ))}
            </div>
        </div>
    )
}

export default CardList;
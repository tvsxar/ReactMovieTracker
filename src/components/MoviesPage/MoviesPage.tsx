import './MoviesPage.scss';

// context + hooks
import { useContext, useState } from "react";
import { MovieContext } from '../MovieContext/MovieContext';

// components
import Card from '../Card/Card';

// types
import type { Genre } from '../MovieContext/MovieContext';

function MoviesPage() {
    const { movies, movieGenres } = useContext(MovieContext) ?? { movies: [], movieGenres: {genres: []} };
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    console.log(movies.length)

    const movieList = selectedGenre === ''
        ? movies
        : movies.filter(movie => {
            const genre = movieGenres.genres.find(genre => genre.name === selectedGenre);
            return genre ? movie.genre_ids.includes(genre.id) : false;
        });

    return (
        <section className="movies-page">
            <div className="container">
                <div className="movies-page-text">
                    <div className="movies-page-title">Popular movies</div>

                    <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                        <option key="default" value="">Select genre</option>
                        {movieGenres.genres.length > 0 ? (
                            movieGenres.genres.map((genre: Genre) => (
                                <option key={genre.id} value={genre.name}>{genre.name}</option>
                            ))
                        ) : (
                            <option disabled>Loading genres...</option>
                        )}
                    </select>
                </div>

                <div className="movie-list">
                    {movieList.map(movie => (
                        <Card key={movie.id} isMini={true} movie={movie} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MoviesPage;
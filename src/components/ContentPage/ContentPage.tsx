import './ContentPage.scss';

// context + hooks
import { useEffect, useContext, useState } from "react";
import { MovieContext } from '../MovieContext/MovieContext';

// components
import Card from '../Card/Card';

// types
import type { Genre, Movie } from '../MovieContext/MovieContext';
interface contentPageProps {
    type: 'Movies' | 'TV Shows';
}

function ContentPage({ type }: contentPageProps) {
    // context
    const { movies, shows, moviePage, showPage, movieGenres, showGenres, nextPageMovies, nextPageShows, prevPageMovies, prevPageShows, setFirstPage } = useContext(MovieContext) ?? {
        movies: [],
        shows: [],
        moviePage: 1,
        showPage: 1,
        movieGenres: [],
        showGenres: [],

        nextPageShows: () => {},
        prevPageShows: () => {},
        nextPageMovies: () => {},
        prevPageMovies: () => {},
        setFirstPage: () => {},
    };
    const content = type === 'Movies' ? movies : shows;
    const contentGenres = type === 'Movies' ? movieGenres : showGenres;
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [filteredContent, setFilteredContent] = useState<Movie[]>(content);

    useEffect(() => {
        if (selectedGenre) {
            const filtered = filterByGenre(selectedGenre, type);
            setFilteredContent(filtered);
        } else if(selectedGenre === '') {
            setFilteredContent(content); // Reset to all content if no genre is selected
        }
    }, [selectedGenre, type, content]);

    // functions
    function filterByGenre(genreName: string, type: 'Movies' | 'TV Shows') : Movie[] {
        if(type === 'Movies') {
            const genre = movieGenres.find(genre => genre.name === genreName)
            if(genre) {
                return movies.filter(movie => movie.genre_ids.includes(genre.id));
            }

            return movies;
        } else {
            const genre = showGenres.find(genre => genre.name === genreName)
            if(genre) {
                return shows.filter(show => show.genre_ids.includes(genre.id));
            }

            return shows;
        }
    }

    // handlers
    const handleNextPage = () => {
        if(type === 'Movies') {
            nextPageMovies();
        } else if(type === 'TV Shows') {
            nextPageShows();
        }
        window.scrollTo({ top: 725, behavior: 'smooth' });
    };
    
    const handlePrevPage = () => {
        if(type === 'Movies') {
            prevPageMovies();
        } else if(type === 'TV Shows') {
            prevPageShows();
        }
        window.scrollTo({ top: 725, behavior: 'smooth' });
    };


    return (
        <section className="movies-page">
            <div className="container">
                <div className="movies-page-text">
                    <div className="movies-page-title">Popular {type}</div>

                    <select value={selectedGenre} onChange={e => {
                        setFirstPage();
                        setSelectedGenre(e.target.value)
                    }}>
                        <option key="default" value="">All genres</option>
                        {contentGenres.length > 0 ? (
                            contentGenres.map((genre: Genre) => (
                                <option key={genre.id} value={genre.name}>{genre.name}</option>
                            ))
                        ) : (
                            <option disabled>Loading genres...</option>
                        )}
                    </select>
                </div>

                <div className="movie-list">
                    {filteredContent.map(content => (
                        <Card key={content.id} isMini={true} movie={content} />
                    ))}
                </div>

                <div className="pagination">
                    <button onClick={handlePrevPage}>
                        <span>Previous</span>
                    </button>
                    <p>Page {type === 'Movies' ? moviePage : showPage}</p>
                    <button onClick={handleNextPage}>
                        <span>Next</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ContentPage;
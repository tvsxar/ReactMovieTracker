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
    const { movies, shows, moviePage, showPage, movieGenres, showGenres, fetchContentByGenre,
    nextPageMovies, nextPageShows, prevPageMovies, prevPageShows, setFirstPage } = useContext(MovieContext) ?? {
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
        fetchContentByGenre: async () => [],
    };
    const content = type === 'Movies' ? movies : shows;
    const contentGenres = type === 'Movies' ? movieGenres : showGenres;
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [filteredContent, setFilteredContent] = useState<Movie[]>(content);

    useEffect(() => {
        const fetchFilteredContent = async () => {
            if (selectedGenre !== '') {
                const genre = contentGenres.find(genre => genre.name === selectedGenre);
                if (genre) {
                    const filtered = await fetchContentByGenre(genre.id, type === 'Movies' ? moviePage : showPage, type);
                    setFilteredContent(filtered); // Set the resolved array of movies/shows
                }
            } else {
                setFilteredContent(content); // Reset to all content if no genre is selected
            }
        };
    
        fetchFilteredContent();
    }, [selectedGenre, type, content, contentGenres, moviePage, showPage, fetchContentByGenre]);

    // filter content
    

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
        <section className="content-page">
            <div className="container">
                <div className="content-page-text">
                    <div className="content-page-title">Popular {type}</div>

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

                <div className="content-list">
                    {filteredContent.map(content => (
                        <Card type={type === 'Movies' ? 'movie' : 'tv'} key={content.id} isMini={true} movie={content} />
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
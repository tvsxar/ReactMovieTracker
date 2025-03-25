import React, {createContext, useState, useEffect} from 'react';

// interfaces
export interface Movie {
    id: number,
    title: string,
    name: string,
    poster_path: string,
    backdrop_path?: string,
    genre_ids: number[],
    overview: string,
    vote_average: number,
}

export interface Genre {
    id: number,
    name: string,
}

interface GenreList {
    genres: Genre[]
}

interface MovieContextType {
    genres: Genre[];
    movieGenres: GenreList;
    showGenres: GenreList;
    movies: Movie[];
    shows: Movie[];
    trending: Movie[];
    filteredMovies?: Movie[];
    filteredShows?: Movie[];
    filterByGenre: (genreId: number, type: 'movie' | 'tv') => void;
}

interface MovieProviderProps {
    children: React.ReactNode;
}

// creating Context
export const MovieContext = createContext<MovieContextType | null>(null);

export function MovieProvider({ children } : MovieProviderProps)  {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [movieGenres, setMovieGenres] = useState<GenreList>({ genres: [] });
    const [showGenres, setShowGenres] = useState<GenreList>({ genres: [] });
    const [movies, setMovies] = useState<Movie[]>([]);
    const [shows, setShows] = useState<Movie[]>([]);
    const [trending, setTrending] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [filteredShows, setFilteredShows] = useState<Movie[]>([]);
    // API
    const API_KEY = `deddcdf61311b4dd7da8c0a3d2bf5042`;
    const BASE_URL = `https://api.themoviedb.org/3`;

    // genres
    async function fetchGenres() {
        try {
            const movieGenresRes = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
            const movieGenresData = await movieGenresRes.json();
            setMovieGenres(movieGenresData);
                
            const tvGenresRes = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`);
            const tvGenresData = await tvGenresRes.json();
            setShowGenres(tvGenresData);
                
            setGenres([...movieGenresData.genres, ...tvGenresData.genres]);
        } catch(err) {
            console.error('Loading genres error:', err);
        }
    }

    // trending movies
    async function fetchTrendingMovies() {
        try {
            const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
            const data = await response.json();
            setTrending(data.results);
        } catch (error) {
            console.error('Loading trending movies error:', error);
        }
    }

    // popular movies
    async function fetchMovies() {
        try {
            const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
            const data = await response.json();
            setMovies(data.results);
        } catch (error) {
            console.error('Loading movies error:', error);
        }
    }

    // popular shows
    async function fetchShows() {
        try {
            const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
            const data = await response.json();
            setShows(data.results);
        } catch (error) {
            console.error('Loading series error:', error);
        }  
    }

    function filterByGenre(genreId: number, type: 'movie' | 'tv') {
        if(type === 'movie') {
            setFilteredMovies(movies.filter(movie => movie.genre_ids.includes(genreId)));
        } else {
            setFilteredShows(shows.filter(show => show.genre_ids.includes(genreId)));
        }
    }

    useEffect(() => {
        fetchGenres();
        fetchMovies();
        fetchShows();
        fetchTrendingMovies();
    }, []);

    return (
        <MovieContext.Provider value={{ genres, movies, shows, trending, movieGenres, showGenres, filterByGenre }}>
          {children}
        </MovieContext.Provider>
    );
}
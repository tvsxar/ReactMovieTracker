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

interface Genre {
    id: number,
    name: string,
}

interface MovieContextType {
    genres: Genre[];
    movies: Movie[];
    series: Movie[];
    filteredMovies: Movie[];
    filteredSeries: Movie[];
    filterByGenre: (genreId: number, type: 'movie' | 'tv') => void;
}

interface MovieProviderProps {
    children: React.ReactNode;
}

// creating Context
export const MovieContext = createContext<MovieContextType | null>(null);

export function MovieProvider({ children } : MovieProviderProps)  {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [series, setSeries] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [filteredSeries, setFilteredSeries] = useState<Movie[]>([]);

    // API
    const API_KEY = `deddcdf61311b4dd7da8c0a3d2bf5042`;
    const BASE_URL = `https://api.themoviedb.org/3`;

    // genres
    async function fetchGenres() {
        try {
            const movieGenresRes = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
            const movieGenresData = await movieGenresRes.json();
                
            const tvGenresRes = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`);
            const tvGenresData = await tvGenresRes.json();
                
            setGenres([...movieGenresData.genres, ...tvGenresData.genres]);
        } catch(err) {
            console.error('Loading genres error:', err);
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

    // popular series
    async function fetchSeries() {
        try {
            const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
            const data = await response.json();
            setSeries(data.results);
        } catch (error) {
            console.error('Loading series error:', error);
        }  
    }

    function filterByGenre(genreId: number, type: 'movie' | 'tv') {
        if(type === 'movie') {
            setFilteredMovies(movies.filter(movie => movie.genre_ids.includes(genreId)));
        } else {
            setFilteredSeries(series.filter(serie => serie.genre_ids.includes(genreId)));
        }
    }

    useEffect(() => {
        fetchGenres();
        fetchMovies();
        fetchSeries();
    }, []);

    return (
        <MovieContext.Provider value={{ genres, movies, series, filteredMovies, filteredSeries, filterByGenre }}>
          {children}
        </MovieContext.Provider>
    );
}
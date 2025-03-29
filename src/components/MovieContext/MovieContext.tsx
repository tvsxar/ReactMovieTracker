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

interface MovieContextType {
    allGenres: Genre[],
    movieGenres: Genre[];
    showGenres: Genre[];
    movies: Movie[];
    shows: Movie[];
    trending: Movie[];

    moviePage: number;
    showPage: number;
    nextPageMovies: () => void;
    prevPageMovies: () => void;
    nextPageShows: () => void;
    prevPageShows: () => void;
    setFirstPage: () => void;
}

interface MovieProviderProps {
    children: React.ReactNode;
}

// creating Context
export const MovieContext = createContext<MovieContextType | null>(null);

export function MovieProvider({ children } : MovieProviderProps)  {
    const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
    const [showGenres, setShowGenres] = useState<Genre[]>([]);
    const [allGenres, setAllGenres] = useState<Genre[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [shows, setShows] = useState<Movie[]>([]);
    const [trending, setTrending] = useState<Movie[]>([]);
    const [moviePage, setMoviePage] = useState<number>(1);
    const [showPage, setShowPage] = useState<number>(1);

    // API
    const API_KEY = `deddcdf61311b4dd7da8c0a3d2bf5042`;
    const BASE_URL = `https://api.themoviedb.org/3`;

    // Fetch genres
    async function fetchGenres() {
        try {
            const movieGenresRes = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
            const movieGenresData = await movieGenresRes.json();
            setMovieGenres(movieGenresData.genres);
                
            const tvGenresRes = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`);
            const tvGenresData = await tvGenresRes.json();
            setShowGenres(tvGenresData.genres);

            setAllGenres([...movieGenresData.genres, ...tvGenresData.genres])
        } catch(err) {
            console.error('Loading genres error:', err);
        }
    }

    // Fetch trending movies
    async function fetchTrendingMovies() {
        try {
            const response = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
            const data = await response.json();
            setTrending(data.results);
        } catch (error) {
            console.error('Loading trending movies error:', error);
        }
    }

    useEffect(() => {
        fetchGenres();
        fetchTrendingMovies();
    }, []);

    useEffect(() => {
        async function fetchAllMovies(page: number) {
            try {
                const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
                const data = await response.json();

                setMovies(data.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        }
    
        fetchAllMovies(moviePage);
    }, [moviePage]);

    useEffect(() => {
        async function fetchAllShows(page: number) {
            try {
                const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
                const data = await response.json();

                setShows(data.results);
            } catch (error) {
                console.error("Error fetching shows:", error);
            }
        }

        fetchAllShows(showPage);
    }, [showPage])

    // pagination
    function nextPageMovies() {
        setMoviePage(prev => prev + 1);
    }
    
    function prevPageMovies() {
        setMoviePage(prev => (prev > 1 ? prev - 1 : 1));
    }
    
    function nextPageShows() {
        setShowPage(prev => prev + 1);
    }
    
    function prevPageShows() {
        setShowPage(prev => (prev > 1 ? prev - 1 : 1));
    }

    function setFirstPage() {
        setMoviePage(1);
        setShowPage(1);
    }

    return (
        <MovieContext.Provider value={{ allGenres, movies, shows, trending, movieGenres, showGenres, 
        nextPageMovies, prevPageMovies, nextPageShows, prevPageShows, setFirstPage, moviePage, showPage }}>
          {children}
        </MovieContext.Provider>
    );
}
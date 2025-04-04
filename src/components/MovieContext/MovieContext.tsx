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
    media_type?: 'movie' | 'tv';
    trailer? : string;
    genres?: { id: number; name: string }[];
    release_date?: string;
    first_air_date?: string;
    production_countries?: { iso_3166_1: string; name: string }[];
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

    fetchContentByGenre: (genreId: number, page: number, type: 'Movies' | 'TV Shows') => Promise<Movie[]>;
    fetchTopRatedContent: (type: 'movie' | 'tv') => Promise<Movie[]>;
    fetchContentById: (id: number, type: 'movie' | 'tv') => Promise<Movie>;
    fetchSimilarContent: (id: number, type: 'movie' | 'tv') => Promise<Movie[]>;
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

            const filtered = data.results.filter((item: any) =>
                item.overview?.trim() &&
                item.poster_path &&
                Array.isArray(item.genre_ids) && item.genre_ids.length > 0
            );
            setTrending(filtered);
        } catch (error) {
            console.error('Loading trending movies error:', error);
        }
    }

    async function fetchTopRatedContent(type : 'movie' | 'tv') {
        try {
            const response = await fetch(`${BASE_URL}/${type}/top_rated?api_key=${API_KEY}`);
            const data = await response.json();
            
            const filtered = data.results.filter((item: any) =>
                item.overview?.trim() &&
                item.poster_path &&
                Array.isArray(item.genre_ids) && item.genre_ids.length > 0
            );

            return filtered;
        } catch (error) {
            console.error('Loading top rated movies error:', error)
        }
    }

    async function fetchContentById(id: number, type: 'movie' | 'tv') {
        try {
            const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
            const data = await response.json();

            const videoResponse = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
            const videoData = await videoResponse.json();

            const trailer = videoData.results.find((video: any) => video.type === "Trailer" && video.site === "YouTube");

            return { ...data, trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null };
        } catch(error) {
            console.error('Loading content by ID error:', error);
            return null;
        }
    }

    async function fetchSimilarContent(id: number, type: 'movie' | 'tv') {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}`);
            const data = await response.json();

            const filtered = data.results.filter((item: any) =>
                item.overview?.trim() &&
                item.poster_path &&
                Array.isArray(item.genre_ids) && item.genre_ids.length > 0
            );

            return filtered.slice(0, 5);
        } catch(error) {
            console.error('Loading similar content error:', error);
        }
    }

    // content by genre
    async function fetchContentByGenre(genreId: number, page: number, type: 'Movies' | 'TV Shows') {
        const response = await fetch(
          `${BASE_URL}/discover/${type === 'Movies' ? 'movie' : 'tv'}?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
        );
        const data = await response.json();

        return data.results;
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

                const filtered = data.results.filter((item: any) =>
                    item.overview?.trim() &&
                    item.poster_path &&
                    Array.isArray(item.genre_ids) && item.genre_ids.length > 0
                );
                setMovies(filtered);
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

                const filtered = data.results.filter((item: any) =>
                    item.overview?.trim() &&
                    item.poster_path &&
                    Array.isArray(item.genre_ids) && item.genre_ids.length > 0
                );
                setShows(filtered);
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
        <MovieContext.Provider value={{ allGenres, movies, shows, trending, movieGenres, showGenres, fetchContentByGenre, fetchContentById, fetchSimilarContent,
            fetchTopRatedContent, nextPageMovies, prevPageMovies, nextPageShows, prevPageShows, setFirstPage, moviePage, showPage }}>
          {children}
        </MovieContext.Provider>
    );
}
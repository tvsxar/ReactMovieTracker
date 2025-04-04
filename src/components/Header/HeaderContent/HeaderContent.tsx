import './HeaderContent.scss';

// react + context + router
import { useContext, useState, useEffect } from "react";
import { MovieContext } from '../../MovieContext/MovieContext'; 
import { useLocation } from "react-router-dom";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";

// components
import Card from '../../Card/Card';

// types
import type { Movie } from '../../MovieContext/MovieContext';
interface HeaderContentProps {
    setBackground: (bg: string) => void;
}

function HeaderContent({setBackground} : HeaderContentProps) {
    const { trending, fetchTopRatedContent } = useContext(MovieContext) ?? { trending: [], fetchTopRatedContent: async () => [] };
    const [randomMovies, setRandomMovies] = useState<Movie[]>([]);
    const [content, setContent] = useState<Movie[]>([]);
    const [info, setInfo] = useState<string>('Trending');

    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isMoviesPage = location.pathname === '/movies';
    const isTVShowsPage = location.pathname === '/tvshows';

    // hooks
    useEffect(() => {
        const fetchContent = async () => {
            if (isHomePage) {
                setContent(trending);
                setInfo('Trending');
            } else if (isMoviesPage && fetchTopRatedContent) {
                const topRatedMovies = await fetchTopRatedContent('movie');
                setContent(topRatedMovies); // Set the resolved array of movies
                setInfo('Top Rated Movies');
            } else if (isTVShowsPage && fetchTopRatedContent) {
                const topRatedShows = await fetchTopRatedContent('tv');
                setContent(topRatedShows); // Set the resolved array of TV shows
                setInfo('Top Rated TV Shows');
            }
        }

        fetchContent();
    }, [isHomePage, isMoviesPage, isTVShowsPage, trending, fetchTopRatedContent])

    useEffect(() => {
        if (content.length > 0) {
            const shuffled = [...content]
                .sort(() => 0.5 - Math.random()) // mix
                .filter(movie => movie.backdrop_path && movie.poster_path) // only with bg
                .slice(0, 5); // 5 random
    
            setRandomMovies(shuffled);
            setBackground(shuffled[0]?.backdrop_path || '');
        }
    }, [content]);

    // functions
    const getType = (movie: Movie) => {
        return movie.media_type || (isMoviesPage ? 'movie' : 'tv');
    };

    return (
        <div className='header-content'>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                navigation={true}
                onSlideChange={(swiper) => {
                    setBackground(randomMovies[swiper.realIndex]?.backdrop_path || "");
                }}
            >
                {randomMovies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <Card type={getType(movie)} info={info} movie={movie} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default HeaderContent;
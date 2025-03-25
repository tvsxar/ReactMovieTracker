import './HeaderContent.scss';

// react + context
import { useContext, useState, useEffect } from "react";
import { MovieContext } from '../../MovieContext/MovieContext'; 

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
    const { trending } = useContext(MovieContext) ?? { trending: [] };
    const [randomMovies, setRandomMovies] = useState<Movie[]>([]);

    useEffect(() => {
        if (trending.length > 0) {
            const shuffled = [...trending]
                .sort(() => 0.5 - Math.random()) // mix
                .filter(movie => movie.backdrop_path && movie.poster_path) // only with bg
                .slice(0, 5); // 5 random
    
            setRandomMovies(shuffled);
            setBackground(shuffled[0]?.backdrop_path || '');
        }
    }, [trending]);

    return (
        <div className="header-content">
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
                        <Card movie={movie} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default HeaderContent;
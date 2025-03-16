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
    const { movies } = useContext(MovieContext) ?? { movies: [] };
    const [randomMovies, setRandomMovies] = useState<Movie[]>([]);

    useEffect(() => {
        if(movies.length > 0) {
            const shuffled = [...movies].sort(() => 0.5 - Math.random());

            // ?? check if movie have bg image
            setRandomMovies(shuffled.slice(0, 5));

            setBackground(randomMovies[0]?.backdrop_path || '');
        }
    }, [movies])

    return (
        <div className="header-content">
            <Swiper
                spaceBetween={10}
                slidesPerView={1}
                onSlideChange={(swiper) => {
                    setBackground(randomMovies[swiper.activeIndex]?.backdrop_path || "");
                }}
            >
                {randomMovies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <Card randomMovies={randomMovies} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default HeaderContent;
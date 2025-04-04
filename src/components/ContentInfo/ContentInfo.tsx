import './ContentInfo.scss';

// react + context + router
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { MovieContext } from '../MovieContext/MovieContext';

// components
import Card from '../Card/Card';

// types
import { Movie } from '../MovieContext/MovieContext';

// images
import star from '../../assets/star.svg';

function ContentInfo() {
    const { fetchContentById, fetchSimilarContent } = useContext(MovieContext) ?? { fetchContentById: async () => {}, fetchSimilarContent: async () => [] };
    const [content, setContent] = useState<null | Movie>(null);
    const [similarContent, setSimilarContent] = useState<Movie[]>([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const { id, type } = useParams();

    // responsiveness
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const cardsToShow = windowWidth <= 1024 ? 4 : 5;
    const displayedSimilar = similarContent.slice(0, cardsToShow);

    // fetch data
    useEffect(() => {
        async function fetchContent() {
            if(id) {
                const contentData = await fetchContentById(parseInt(id), type as 'movie' | 'tv');
                const similarData = await fetchSimilarContent(parseInt(id), type as 'movie' | 'tv');
                
                if(contentData) setContent(contentData);

                if(similarData) setSimilarContent(similarData);
            }
        }

        fetchContent();
    }, [id])

    return (
        <div className="content-info">
            <div className="container">
                <div className="content-info-section">
                    <h1 className="content-info-title">About</h1>

                    {content?.trailer ? (
                        <div className="content-info-player">
                            <iframe
                                src={content.trailer}
                                title="Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="content-info-player">
                            <img
                                src={`https://image.tmdb.org/t/p/original${content?.backdrop_path || content?.poster_path}`}
                                alt={content?.title || content?.name}
                                className="content-poster"
                            />
                            {/* <p className="no-trailer-text">🚫 Trailer Not Available</p> */}
                        </div>
                    )}

                    <div className="content-info-details">
                        <div className="content-info-main">
                            <h2 className="content-title">{content?.title || content?.name}</h2>

                            <div className="content-rating">
                                <img src={star} alt="star" className="star" />

                                <p className="rating">{`${content?.vote_average}/10`}</p>
                            </div>
                        </div>

                        <p className="content-details">
                            {[
                            content?.release_date?.split('-')[0] || content?.first_air_date?.split('-')[0] || 'Unknown Year',
                            content?.production_countries?.[0]?.name || 'Unknown Country',
                            content?.genres?.map(genre => genre.name).join(', ') || 'Unknown Genres'
                            ].join(' | ')}
                        </p>

                        <div className="content-description">
                            <h4 className="about-title">About</h4>

                            <p className="description">{content?.overview || "No description available."}</p>
                        </div>
                    </div>

                    <div className="similar-content">
                        <h4 className="similar-title">Similar content</h4>

                        <div className="similar">
                            {displayedSimilar?.map((movie) => (
                                <Card key={movie.id} movie={movie} type={type as 'movie' | 'tv'} isMini />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentInfo;
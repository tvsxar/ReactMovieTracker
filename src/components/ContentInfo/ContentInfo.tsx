import './ContentInfo.scss';

// react + context + router
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { MovieContext } from '../contexts/MovieContext';
import { useAuth } from '../contexts/AuthContext';

// components
import Card from '../Card/Card';

// types
import { Movie } from '../contexts/MovieContext';

// images
import rating from '../../assets/rating.svg';
import bookmark from '../../assets/bookmark.svg';
import bookmarkOutline from '../../assets/bookmark-outline.svg';

function ContentInfo() {
    const { fetchContentById, fetchSimilarContent } = useContext(MovieContext) ?? { fetchContentById: async () => {}, fetchSimilarContent: async () => [] };
    const [content, setContent] = useState<null | Movie>(null);
    const [similarContent, setSimilarContent] = useState<Movie[]>([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isFavorite, setIsFavorite] = useState(false);
    const { id, type } = useParams();
    const auth = useAuth();

    function sanitizeMovie(movie: any, type: 'movie' | 'tv'): Movie {
        return {
          id: movie.id,
          title: movie.title || '',
          name: movie.name || '',
          poster_path: movie.poster_path || '',
          backdrop_path: movie.backdrop_path || '',
          overview: movie.overview || '',
          vote_average: movie.vote_average || 0,
          genre_ids: (movie.genre_ids ?? movie.genres?.map((g: any) => g.id)) || [],
          media_type: type,
        };
    }

    const handleFavoriteToggle = async () => {
        if (!content) return;
      
        const cleaned = sanitizeMovie(content, type as 'movie' | 'tv');
      
        if (isFavorite) {
          await auth?.removeFromFavorites(cleaned.id);
          setIsFavorite(false);
        } else {
          await auth?.addToFavorites(cleaned);
          setIsFavorite(true);
        }
    };

    // scroll to top on mount
    // This effect runs when the component mounts and scrolls to the top of the page
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [content]);

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
    }, [id]);

    useEffect(() => {
        async function checkIfFavorite() {
          if (auth?.user && content) {
            const favs = await auth.getFavorites();
            const exists = favs.some((item: Movie) => item.id === content.id);
            setIsFavorite(exists);
          }
        }
      
        checkIfFavorite();
    }, [content, auth]);

    return (
        <div className="content-info">
            <div className="container">
                <div className="content-info-section">
                    <div className="content-info-title-container">
                        <h1 className="content-info-title">About</h1>
                        {auth?.user && content && (
                            <button className="save-btn" onClick={handleFavoriteToggle}>
                                {isFavorite ? (
                                    <div className="save-btn-active">
                                        <img src={bookmark} alt="bookmark" />
                                        {/* <p>Remove from Favorites</p> */}
                                    </div>
                                ) : (
                                    <div className="save-btn-inactive">
                                        <img src={bookmarkOutline} alt="bookmarkOutline" />
                                        {/* <p>Add to Favorites</p> */}
                                    </div>
                                )}
                            </button>
                        )}
                    </div>

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
                                <img src={rating} alt="star" className="star" />

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
                            {displayedSimilar.length > 0 ? (displayedSimilar?.map((movie) => (
                                <Card key={movie.id} movie={movie} type={type as 'movie' | 'tv'} isMini />
                            ))) : (
                                <p>{`No similar content :(`}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentInfo;
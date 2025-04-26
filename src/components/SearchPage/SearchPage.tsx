import './SearchPage.scss';

// react + router
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { MovieContext } from '../MovieContext/MovieContext';

// components
import Card from '../Card/Card';

// type
import type { Movie } from '../MovieContext/MovieContext';

function SearchPage() {
    const { fetchContentByInput } = useContext(MovieContext) ?? { fetchContentByInput: async () => [] };

    // search params + state + query
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    // fetch content by input
    useEffect(() => {
        async function searchByQuery() {
            const list = await fetchContentByInput(query);
            setSearchResults(list);
        }

        searchByQuery()
    }, [query])

    return (
        <div className="search-page">
            <div className="container">
                <h1 className="search-title">Search Results for: "{query}"</h1>

                {searchResults.length > 0 ? (
                    <div className="search-cards">
                        {searchResults.map(movie => (
                            <Card key={movie.id} movie={movie} type={movie.media_type as 'movie' | 'tv'} isMini />
                     ))}
                    </div>
                ) : (
                    <div className="no-results">{`No results found :(`}</div>
                )}
            </div>
        </div>
    )
}

export default SearchPage;
import './AccountPage.scss';
import { useState, useEffect, useContext } from 'react';
import Card from '../Card/Card';

// images
import googleLogo from '../../assets/google.svg';
import refreshIcon from '../../assets/refresh.svg'

import { useAuth } from '../contexts/AuthContext';
import { MovieContext } from '../contexts/MovieContext';

// types
import { Movie } from '../contexts/MovieContext';

function AccountPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [suggested, setSuggested] = useState<Movie[]>([]);

    // get max number from window width
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function getMaxNumber() {
        if (windowWidth < 768) return 4;
        if (windowWidth < 1024) return 5;
        return 6;
    }

    // from context
    const auth = useAuth()!;
    const { fetchRecommendedContent } = useContext(MovieContext) ?? { fetchRecommendedContent: async () => [] };

    // fetch liked content
    useEffect(() => {
        if (auth?.user) {
            async function fetchFavorites() {
                const favs = await auth.getFavorites();
                setFavorites(favs);
            }

            fetchFavorites();
        }
    }, [auth]);

    // fetch recommended content
    useEffect(() => {
        async function loadRecommendations() {
            if (favorites.length > 0) {
                const recommended = await fetchRecommendedContent(favorites, getMaxNumber());
                setSuggested(recommended);
            }
        }
    
        loadRecommendations();
    }, [favorites, fetchRecommendedContent, windowWidth]);

    function toggleForm() {
        setIsLogin(prev => !prev);
    }

    function clearInputs() {
        setEmail('');
        setConfirmPassword('');
        setPassword('');
    }

    async function handleAuth(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !password) return;

        try {
            if (isLogin) {
              await auth?.login(email, password);
            } else {
              if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
              }
              await auth?.register(email, password);
            }
        } catch (err) {
            console.error(err);
            alert('Authentication failed');
        }

        clearInputs();
    }

    const refreshRecommendations = async () => {
        if (favorites.length > 0) {
            const recommended = await fetchRecommendedContent(favorites, getMaxNumber());
            setSuggested(recommended);
        }
    };

    if (auth?.user) {
        return (
            <div className="account-page logged-page">
                <div className="container">
                    <div className="account-page-content">
                        <div className="account-info">
                            <h1 className="account-title">Welcome, {auth.user.email}</h1>
                            <button onClick={auth.logout} className="logout-btn">Logout</button>
                        </div>

                        <div className="favorite-content-container">
                            <h2 className="favorite-content-title">Favorite content</h2>

                            <div className="favorites-content">
                                {favorites.length > 0 ? (
                                    favorites.map((item) => (
                                    <Card
                                      key={item.id}
                                      movie={item}
                                      type={item.media_type}
                                      isMini
                                    />
                                  ))
                                ) : (
                                  <p>No favorites yet.</p>
                                )}
                            </div>

                            <div className="for-you-section">
                                <div className="for-you-flex">
                                    <h2 className="for-you-title">For You</h2>
                                    <button className="refresh-btn" onClick={refreshRecommendations}>
                                        <img src={refreshIcon} alt="refresh" className="refresh" />
                                    </button>
                                </div>
                                <div className="for-you-cards">
                                    {suggested.length > 0 ? (
                                        suggested.map(movie => (
                                            <Card key={movie.id} movie={movie} type={movie.media_type} isMini />
                                        ))
                                    ) : (
                                        <p>Add favorites to see your recommendations.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="account-page">
            <div className="container">
                <div className="form-container">
                <div className="account-form">
                    <h1>{isLogin ? 'Login to Your Account' : 'Create a New Account'}</h1>

                    <form className="auth-form" onSubmit={handleAuth}>
                        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        
                        {!isLogin && (
                            <input type="password" placeholder="Confirm Password" required 
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        )}

                        <button type="submit">{isLogin ? 'Login' : 'Create'}</button>
                    </form>

                    <div className="divider">or</div>

                    <button type='button' className="google-btn" onClick={auth?.loginWithGoogle}>
                        <img src={googleLogo} alt="Google" />
                        Continue with Google
                    </button>

                    <div className="toggle-auth">
                        {isLogin ? (
                            <p>Don't have an account? <span onClick={toggleForm}>Create</span></p>
                        ) : (
                            <p>Already have an account? <span onClick={toggleForm}>Login</span></p>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage;
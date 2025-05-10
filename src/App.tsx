// provider + router
import { MovieProvider } from "./components/contexts/MovieContext";
import AuthProvider from "./components/contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import Header from './components/Header/Header';
import Recommendations from './components/Recommendations/Recommendations';
import ContentPage from './components/ContentPage/ContentPage';
import ContentInfo from './components/ContentInfo/ContentInfo';
import SearchPage from './components/SearchPage/SearchPage';
import AccountPage from './components/AccountPage/AccountPage';
import Footer from './components/Footer/Footer';

function App() {

  return (
      <Router>
        <AuthProvider>
        <MovieProvider>

        <Header />

        <Routes>
          <Route path="/" element={<Recommendations />} />

          <Route path="/movies" element={<ContentPage key="movies" type={'Movies'} />} />

          <Route path="/tvshows" element={<ContentPage key="tvshows" type={'TV Shows'} />} />

          <Route path="/saved" element={<Recommendations />} />

          <Route path="/info/:type/:id" element={<ContentInfo />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/account" element={<AccountPage />} />
        </Routes>
        
        <Footer />

        </MovieProvider>
        </AuthProvider>
      </Router>
  )
}

export default App;

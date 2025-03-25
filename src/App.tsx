// provider + router
import { MovieProvider } from "./components/MovieContext/MovieContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import Header from './components/Header/Header';
import Recommendations from './components/Recommendations/Recommendations';
import MoviesPage from './components/MoviesPage/MoviesPage';
import Footer from './components/Footer/Footer';

function App() {

  return (
    <MovieProvider>
      <Router>
        <Header />
        
         <Routes>
            <Route path="/" element={<Recommendations />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tvshows" element={<Recommendations />} />
            <Route path="/saved" element={<Recommendations />} />
          </Routes>
        
        <Footer />
      </Router>
    </MovieProvider>
  )
}

export default App

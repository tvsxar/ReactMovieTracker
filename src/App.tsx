import { MovieProvider } from "./components/MovieContext/MovieContext";

// components
import Header from './components/Header/Header';
import Recommendations from './components/Recommendations/Recommendations';
import Footer from './components/Footer/Footer';

function App() {

  return (
    <MovieProvider>
      <div className="App">
        <Header />
        <Recommendations />
        <Footer />
      </div>
    </MovieProvider>
  )
}

export default App

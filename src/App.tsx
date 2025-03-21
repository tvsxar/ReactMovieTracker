import { MovieProvider } from "./components/MovieContext/MovieContext";

// components
import Header from './components/Header/Header';
import Recommendations from './components/Recommendations/Recommendations';

function App() {

  return (
    <MovieProvider>
      <div className="App">
        <Header />
        <Recommendations />
      </div>
    </MovieProvider>
  )
}

export default App

import { MovieProvider } from "./components/MovieContext/MovieContext";

// components
import Header from './components/Header/Header';

function App() {

  return (
    <MovieProvider>
      <div className="App">
        <Header />
      </div>
    </MovieProvider>
  )
}

export default App

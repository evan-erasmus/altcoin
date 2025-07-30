import './App.css';
import Home from './pages/home';
import CoinPage from './pages/coin-history-page';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<CoinPage />} />
      </Routes>
    </div>
  );
}

export default App;

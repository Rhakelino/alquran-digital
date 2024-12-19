import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SurahDetail from './Pages/SurahDetail';
import { CiDark } from "react-icons/ci";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Halaman utama */}
        <Route path="/surah/:id" element={<SurahDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;

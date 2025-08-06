import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SurahDetail from './Pages/SurahDetail';
import NotFound from './Pages/notFound'; // Tambahkan halaman Not Found
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Halaman utama */}
        <Route path="/surah/:id" element={<SurahDetail />} /> {/* Detail Surah */}
        <Route path="*" element={<NotFound />} /> {/* Halaman Error Not Found */}
        <Route path="/surah/*" element={<NotFound />} /> {/* Halaman Error Not Found */}
      </Routes>
      <PWAInstallPrompt />
    </Router>
  );
}

export default App;

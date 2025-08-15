import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SurahDetail from './Pages/SurahDetail';
import NotFound from './Pages/notFound'; // Tambahkan halaman Not Found
import InstallPWA from './components/InstallPWA';
import MainMenu from './Pages/MainMenu';
import JadwalSholat from './Pages/WaktuSholat';
import LastRead from './Pages/LastRead';

function App() {
  return (
    <Router>
      <InstallPWA />
      <Routes>
        <Route path="/" element={<MainMenu />} /> {/* Halaman utama */}
        <Route path="/quran" element={<Home />} /> {/* Halaman utama */}
        <Route path="/quran/surah/:id" element={<SurahDetail />} /> {/* Detail Surah */}
        <Route path="/prayer-times" element={<JadwalSholat />} /> {/* Detail Surah */}
        <Route path="*" element={<NotFound />} /> {/* Halaman Error Not Found */}
        <Route path="/surah/*" element={<NotFound />} /> {/* Halaman Error Not Found */}
         <Route path="/last-read" element={<LastRead />} />
      </Routes>
    </Router>
  );
}

export default App;

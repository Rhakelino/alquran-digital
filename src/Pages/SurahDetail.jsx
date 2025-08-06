import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";

function SurahDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // State untuk mengontrol audio
  const [playing, setPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  
  // State untuk mode gelap
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fungsi cache
  const saveSurahToCache = (surahData) => {
    try {
      localStorage.setItem(`surah_${id}`, JSON.stringify(surahData));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  };

  const getSurahFromCache = () => {
    try {
      const cachedSurah = localStorage.getItem(`surah_${id}`);
      return cachedSurah ? JSON.parse(cachedSurah) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  };

  // Effect untuk status online/offline
  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  // Effect untuk mengambil data surah
  useEffect(() => {
    const getSurahDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cek koneksi internet
        if (!navigator.onLine) {
          const cachedSurah = getSurahFromCache();
          if (cachedSurah) {
            setSurah(cachedSurah);
            setLoading(false);
            setIsOffline(true);
            return;
          }
        }

        // Ambil dari API
        const response = await axios.get(`https://api.quran.gading.dev/surah/${id}`, {
          timeout: 10000
        });
        
        if (response.data && response.data.data) {
          setSurah(response.data.data);
          saveSurahToCache(response.data.data);
          setLoading(false);
        } else {
          throw new Error('Data tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching surah detail:', error);
        
        const cachedSurah = getSurahFromCache();
        if (cachedSurah) {
          setSurah(cachedSurah);
          setIsOffline(true);
          setLoading(false);
        } else {
          setError(error.message);
          setLoading(false);
          navigate('/notFound');
        }
      }
    };

    // Memeriksa mode gelap dari localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }

    getSurahDetail();
  }, [id, navigate]);

  // Toggle audio
  const togglePlayPause = (verseIndex, audioUrl) => {
    if (playing === verseIndex) {
      audio.pause();
      setPlaying(null);
    } else {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      const newAudio = new Audio(audioUrl);

      newAudio.addEventListener('ended', () => {
        setPlaying(null);
      });

      newAudio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });

      setAudio(newAudio);
      setPlaying(verseIndex);
    }
  };

  // Toggle mode gelap
  const toggleMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Komponen peringatan offline
  const OfflineWarning = () => (
    <div className={`
      fixed top-0 left-0 right-0 
      bg-yellow-500 text-white 
      text-center p-2 z-50
    `}>
      Anda sedang offline. Menggunakan data tersimpan.
    </div>
  );

  // Handling loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/img/loading.png" className="w-20" alt="Loading..." />
      </div>
    );
  }

  // Handling error
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <>
      {isOffline && <OfflineWarning />}
      <div className={`
        min-h-screen 
        ${isDarkMode
          ? 'bg-gradient-to-br from-[#1E1E1E] to-black'
          : 'bg-gray-100'
        } 
        transition-colors duration-300 ease-in-out
      `}>
        <div className="container mx-auto md:px-4 md:py-8 max-w-3xl">
          <div className={`
            md:rounded-xl 
            shadow-2xl 
            p-6 
            ${isDarkMode
              ? 'bg-black text-gray-300 border border-[#2C2C2C]'
              : 'bg-white text-gray-800'
            } 
            transition-all duration-300
          `}>
            {/* Header Surah */}
            <div className="flex justify-between items-center mb-6">
              <Link to={'/'}>
                <IoHome className={`
                  text-2xl 
                  ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}
                  transition-colors
                `} />
              </Link>
              <button
                onClick={toggleMode}
                className={`
                  p-2 rounded-full transition-colors 
                  ${isDarkMode
                    ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {isDarkMode ? <CiLight className='text-2xl' /> : <CiDark className='text-2xl' />}
              </button>
            </div>

            {/* Informasi Surah */}
            <div className="text-center mb-8">
              <h1 className={`
                text-xl font-medium 
                ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
              `}>
                {surah.name.transliteration.id}
              </h1>
              <p className={`
                font-[Amiri] text-2xl 
                ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
              `}>
                {surah.name.short}
              </p>
              <p className={`
                mt-2 
                ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}
              `}>
                Surah ke-{surah.number} | {surah.numberOfVerses} Ayat
              </p>
            </div>

            {/* Daftar Ayat */}
            <div className="space-y-4">
              {surah.verses.map((verse, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`
                      w-8 h-8 rounded-full flex items-center justify-center 
                      ${isDarkMode 
                        ? 'bg-neutral-700 text-gray-300' 
                        : 'bg-gray-200 text-gray-700'
                      }
                    `}>
                      {i + 1}
                    </span>
                    <button
                      onClick={() => togglePlayPause(i, verse.audio.primary)}
                      className={`
                        p-2 rounded-full 
                        ${isDarkMode 
                          ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }
                        transition-colors
                      `}
                    >
                      {playing === i ? <FaPause /> : <FaPlay />}
                    </button>
                  </div>
                  
                  <p className={`
                    text-right font-[Amiri] text-2xl mb-2 
                    ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
                  `}>
                    {verse.text.arab}
                  </p>
                  <p className={`
                    text-right text-sm mb-1 
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    {verse.text.transliteration.en}
                  </p>
                  <p className={`
                    text-right 
                    ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}
                  `}>
                    {verse.translation.id}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className={`
            text-center py-4 mt-4 
            ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}
          `}>
            <p className='font-medium'>Made With ❤️ By Rhakelino</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default SurahDetail;
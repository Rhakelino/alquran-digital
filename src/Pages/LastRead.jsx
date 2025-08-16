import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { CiDark, CiLight } from "react-icons/ci";

function LastRead() {
  const navigate = useNavigate();
  const [lastRead, setLastRead] = useState(null);
  const [surahDetail, setSurahDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }
  }, []);

  // Load last read data
  useEffect(() => {
    const savedLastRead = localStorage.getItem('lastRead');
    if (savedLastRead) {
      const parsedLastRead = JSON.parse(savedLastRead);
      setLastRead(parsedLastRead);

      // Fetch surah details
      const fetchSurahDetail = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`https://api.quran.gading.dev/surah/${parsedLastRead.surahNumber}`);
          setSurahDetail(response.data.data);
        } catch (error) {
          console.error('Error fetching surah details', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSurahDetail();
    }
  }, []);

  const toggleMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

 // Ubah fungsi handleNavigateToSurah
const handleNavigateToSurah = () => {
  if (lastRead) {
    // Tambahkan parameter query 'ayat' untuk scroll otomatis
    navigate(`/quran/surah/${lastRead.surahNumber}?ayat=${lastRead.verseNumber}`);
  }
};

  const clearLastRead = () => {
    localStorage.removeItem('lastRead');
    setLastRead(null);
    setSurahDetail(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/img/loading.png" className="w-20" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className={`
  min-h-screen 
  ${isDarkMode
    ? 'bg-gradient-to-br from-neutral-900 to-neutral-950'
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
        ? 'bg-neutral-900 text-neutral-300 border border-neutral-800'
        : 'bg-white text-gray-800'
      } 
      transition-all duration-300
    `}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/')}>
          <IoHome className={`
            text-2xl 
            ${isDarkMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-gray-600 hover:text-gray-800'}
            transition-colors
          `} />
        </button>
        <button
          onClick={toggleMode}
          className={`
            p-2 rounded-full transition-colors 
            ${isDarkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          {isDarkMode ? <CiLight className='text-2xl' /> : <CiDark className='text-2xl' />}
        </button>
      </div>

      {/* Konten Terakhir Baca */}
      {lastRead ? (
        <div className="text-center">
          <h2 className={`
            text-2xl font-bold mb-4
            ${isDarkMode ? 'text-neutral-100' : 'text-gray-900'}
          `}>
            Terakhir Dibaca
          </h2>

          <div className={`
            p-6 rounded-xl mb-4
            ${isDarkMode 
              ? 'bg-neutral-800 text-neutral-300' 
              : 'bg-gray-200 text-gray-800'
            }
          `}>
            <p className="text-lg mb-2">
              Surah: {lastRead.surahName}
            </p>
            <p className="text-xl font-bold">
              Ayat: {lastRead.verseNumber}
            </p>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleNavigateToSurah}
              className={`
                px-6 py-3 rounded-lg
                ${isDarkMode
                  ? 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
            >
              Lanjutkan Membaca
            </button>
            <button
              onClick={clearLastRead}
              className={`
                px-6 py-3 rounded-lg
                ${isDarkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
                }
              `}
            >
              Hapus Terakhir Baca
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className={`
            text-xl
            ${isDarkMode ? 'text-neutral-500' : 'text-gray-600'}
          `}>
            Belum ada riwayat pembacaan
          </p>
        </div>
      )}
    </div>
  </div>
</div>
  );
}

export default LastRead;
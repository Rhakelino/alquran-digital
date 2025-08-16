import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { FaPlay, FaPause, FaCheck, FaTimes } from "react-icons/fa";
import { CiDark, CiLight } from "react-icons/ci";

function SurahDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [hoveredVerse, setHoveredVerse] = useState(null);

  // Audio state
  const [playing, setPlaying] = useState(null);
  const [audio, setAudio] = useState(null);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Selected verse state
  const [selectedVerse, setSelectedVerse] = useState(null);

  // Modal states
  const [longPressVerse, setLongPressVerse] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Scroll to verse state
  const [scrollToVerse, setScrollToVerse] = useState(null);

  // Refs for verses
  const verseRefs = useRef({});

  // Tooltip close handler
  const handleCloseTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('longPressTooltipDismissed', 'true');
  };

  // Load tooltip dismissed status from localStorage
  useEffect(() => {
    const tooltipDismissed = localStorage.getItem('longPressTooltipDismissed');
    if (tooltipDismissed === 'true') {
      setShowTooltip(false);
    }
  }, []);

  // Extract query param ayat and set scrollToVerse and selectedVerse
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ayatParam = searchParams.get('ayat');
    if (ayatParam) {
      const verseNum = parseInt(ayatParam);
      setScrollToVerse(verseNum);
      setSelectedVerse(verseNum);
    }
  }, [location.search]);

  // Scroll to specific verse after loading
  useEffect(() => {
    if (!loading && scrollToVerse && surah) {
      setTimeout(() => {
        const element = verseRefs.current[scrollToVerse];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1000);
    }
  }, [loading, scrollToVerse, surah]);

  // Confirm Last Read modal action
  const confirmLastRead = () => {
    if (longPressVerse) {
      saveLastReadVerse(longPressVerse);
      setShowSuccessModal(true);
      setSelectedVerse(longPressVerse);
      setLongPressVerse(null);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    }
  };

  // Cancel last read modal
  const cancelLastRead = () => {
    setLongPressVerse(null);
  };

  // Cache surah data to localStorage
  const saveSurahToCache = (surahData) => {
    try {
      localStorage.setItem(`surah_${id}`, JSON.stringify(surahData));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  };

  // Get surah data from cache
  const getSurahFromCache = () => {
    try {
      const cachedSurah = localStorage.getItem(`surah_${id}`);
      return cachedSurah ? JSON.parse(cachedSurah) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  };

  // Save last read verse to localStorage
  const saveLastReadVerse = useCallback((verseNumber) => {
    if (!surah) return;

    try {
      const lastReadData = {
        surahNumber: surah.number,
        surahName: surah.name.transliteration.id,
        verseNumber: verseNumber
      };

      localStorage.setItem('lastRead', JSON.stringify(lastReadData));
    } catch (error) {
      console.error('Error saving last read verse', error);
    }
  }, [surah]);

  // Online/offline status effect
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

  // Load last read verse from localStorage on component mount or id change
  useEffect(() => {
    const savedLastRead = localStorage.getItem('lastRead');
    if (savedLastRead) {
      const parsedLastRead = JSON.parse(savedLastRead);
      if (parsedLastRead.surahNumber === parseInt(id)) {
        setSelectedVerse(parsedLastRead.verseNumber);
      }
    }
  }, [id]);

  // Fetch or retrieve surah detail
  useEffect(() => {
    const getSurahDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!navigator.onLine) {
          const cachedSurah = getSurahFromCache();
          if (cachedSurah) {
            setSurah(cachedSurah);
            setLoading(false);
            setIsOffline(true);
            return;
          }
        }

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

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }

    getSurahDetail();
  }, [id, navigate]);

  // Toggle audio play and pause
  const togglePlayPause = (verseIndex, audioUrl) => {
    if (playing === verseIndex) {
      audio?.pause();
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

  // Toggle dark mode
  const toggleMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Offline warning component
  const OfflineWarning = () => (
    <div className="
      fixed top-0 left-0 right-0 
      bg-yellow-500 text-white 
      text-center p-2 z-50
    ">
      Anda sedang offline. Menggunakan data tersimpan.
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/img/loading.png" className="w-20" alt="Loading..." />
      </div>
    );
  }

  // Error state
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
      {showTooltip && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
          <div className={`
            mt-4 p-4 rounded-lg shadow-lg 
            flex items-center justify-between
            max-w-md w-full
            ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-500 text-white'}
            animate-bounce
          `}>
            <div className="flex items-center space-x-2">
              <span>💡</span>
              <p>Tahan ayat untuk menandai terakhir dibaca</p>
            </div>
            <button
              onClick={handleCloseTooltip}
              className={`
                p-1 rounded-full
                ${isDarkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-600'}
              `}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Long Press Modal */}
      {longPressVerse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`
            p-6 rounded-lg w-80 
            ${isDarkMode ? 'bg-neutral-800 text-gray-300' : 'bg-white text-gray-800'}
          `}>
            <h2 className="text-lg font-bold mb-4">
              Tandai Terakhir Dibaca
            </h2>
            <p className="mb-4">
              Apakah Anda ingin menandai ayat {longPressVerse} sebagai terakhir dibaca?
            </p>
            <div className="flex justify-between">
              <button
                onClick={cancelLastRead}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded
                  ${isDarkMode
                    ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
              >
                <FaTimes /> Batal
              </button>
              <button
                onClick={confirmLastRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaCheck /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`
            p-6 rounded-lg w-80 text-center
            ${isDarkMode ? 'bg-neutral-900 text-neutral-200' : 'bg-blue-500 text-white'}
          `}>
            <FaCheck className="mx-auto text-4xl mb-4" />
            <h2 className="text-lg font-bold mb-2">
              Berhasil
            </h2>
            <p>
              Ayat {selectedVerse} telah ditandai sebagai terakhir dibaca
            </p>
          </div>
        </div>
      )}

      {isOffline && <OfflineWarning />}

      <div className={`
        min-h-screen 
        ${isDarkMode ? 'bg-gradient-to-br from-[#1E1E1E] to-black' : 'bg-gray-100'}
        transition-colors duration-300 ease-in-out
      `}>
        <div className="container mx-auto md:px-4 md:py-8 max-w-3xl">
          <div className={`
            md:rounded-xl 
            shadow-2xl 
            p-6 
            ${isDarkMode ? 'bg-black text-gray-300 border border-[#2C2C2C]' : 'bg-white text-gray-800'} 
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
                  ${isDarkMode ? 'bg-neutral-800 text-gray-300 hover:bg-neutral-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
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
              {surah.verses.map((verse, i) => {
                const verseNumber = i + 1;
                const isSelected = selectedVerse === verseNumber;
                const isHovered = hoveredVerse === verseNumber;

                return (
                  <div
                    key={i}
                    id={`ayat-${verseNumber}`}
                    ref={el => (verseRefs.current[verseNumber] = el)}
                    onClick={() => setLongPressVerse(verseNumber)}
                    onMouseEnter={() => setHoveredVerse(verseNumber)}
                    onMouseLeave={() => setHoveredVerse(null)}
                    className={`
                      cursor-pointer 
                      p-2 rounded-lg 
                      transition-colors
                      ${isSelected
                        ? (isDarkMode
                          ? 'bg-neutral-800 border-l-4 border-neutral-500'
                          : 'bg-blue-100 border-l-4 border-blue-500')
                        : ''
                      }
                      ${!isSelected && isHovered
                        ? (isDarkMode
                          ? 'bg-neutral-700'
                          : 'bg-gray-200')
                        : ''
                      }
                    `}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`
                          w-8 h-8 rounded-full flex items-center justify-center 
                          ${isDarkMode ? 'bg-neutral-700 text-gray-300' : 'bg-gray-200 text-gray-700'}
                        `}>
                          {verseNumber}
                        </span>
                        {isSelected && (
                          <FaCheck className={isDarkMode ? 'text-slate-300' : 'text-blue-500'} />
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayPause(i, verse.audio.primary);
                        }}
                        className={`
                          p-2 rounded-full 
                          ${isDarkMode ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
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
                      text-left 
                      ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}
                    `}>
                      {verse.translation.id}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <footer className={`
            text-center py-4 mt-4 
            ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}
          `}>
            <p className='font-medium'>
              {selectedVerse
                ? `Terakhir dibaca ayat ${selectedVerse}`
                : 'Made With ❤️ By Rhakelino'}
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default SurahDetail;

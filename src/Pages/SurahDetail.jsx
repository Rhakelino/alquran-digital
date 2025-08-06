import { Link, useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";

function SurahDetail() {
  const { id } = useParams(); // Ambil parameter ID dari URL
  const navigate = useNavigate(); // Hook untuk redirect
  const [surah, setSurah] = useState(null); // Data surah
  const [loading, setLoading] = useState(true);

  // State untuk mengontrol apakah ayat diputar atau tidak
  const [playing, setPlaying] = useState(null); // null berarti tidak ada ayat yang diputar
  const [audio, setAudio] = useState(null); // Menyimpan objek audio untuk pemutaran
  
  // State untuk mode gelap
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const getSurahDetail = async () => {
      try {
        const response = await axios.get(`https://api.quran.gading.dev/surah/${id}`);
        
        // Cek apakah data ditemukan
        if (response.data && response.data.data) {
          setSurah(response.data.data); // Simpan data surah
          setLoading(false); // Matikan loading
        } else {
          // Jika tidak ada data (misalnya ID tidak valid)
          setLoading(false); // Matikan loading
          navigate('/notFound'); // Arahkan ke halaman Not Found
        }
      } catch (error) {
        console.error('Error fetching surah detail:', error);
        setLoading(false); // Matikan loading
        navigate('/notFound'); // Arahkan ke halaman Not Found
      }
    };
    getSurahDetail();
  
    // Memeriksa apakah mode gelap disimpan di localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }
  }, [id, navigate]); // Pastikan `navigate` ditambahkan sebagai dependency

  const togglePlayPause = (verseIndex, audioUrl) => {
    if (playing === verseIndex) {
      // Jika ayat yang sama diklik, stop audio
      audio.pause();
      setPlaying(null);
    } else {
      // Jika tombol Play pada ayat lain diklik, stop audio sebelumnya
      if (audio) {
        audio.pause(); // Stop audio yang sedang diputar
        audio.currentTime = 0; // Reset posisi audio ke awal
      }

      const newAudio = new Audio(audioUrl); // Membuat objek audio baru untuk ayat yang dipilih

      // Menangani event 'ended' agar audio berhenti dengan benar setelah selesai diputar
      newAudio.addEventListener('ended', () => {
        setPlaying(null); // Reset state playing setelah audio selesai
      });

      newAudio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });

      setAudio(newAudio); // Simpan objek audio ke state
      setPlaying(verseIndex); // Update state playing
    }
  };

  const toggleMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      // Simpan status mode ke localStorage
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Menentukan kelas untuk mode gelap atau terang
  const modeClass = isDarkMode ? 'dark' : 'light';

  if (loading) {
    return (
      <div>
        <img src="/img/loading.png" className="mx-auto w-20 bg-none" alt="Loading..." />
      </div>
    );
  }

  return (
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
              <div 
                key={i} 
              >
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
  );
}

export default SurahDetail;

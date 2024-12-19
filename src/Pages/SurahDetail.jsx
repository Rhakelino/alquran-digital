import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

function SurahDetail() {
  const { id } = useParams(); // Ambil parameter ID dari URL
  const [surah, setSurah] = useState(null); // Data surah
  const [loading, setLoading] = useState(true);

  // State untuk mengontrol apakah ayat diputar atau tidak
  const [playing, setPlaying] = useState(null); // null berarti tidak ada ayat yang diputar
  const [audio, setAudio] = useState(null); // Menyimpan objek audio untuk pemutaran

  useEffect(() => {
    const getSurahDetail = async () => {
      try {
        const response = await axios.get(`https://api.quran.gading.dev/surah/${id}`);
        setSurah(response.data.data); // Simpan data surah
        setLoading(false); // Matikan loading
      } catch (error) {
        console.error('Error fetching surah detail:', error);
      }
    };
    getSurahDetail();
  }, [id]);

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

  if (loading) {
    return (
      <div>
        <img src="/img/loading.png" className="mx-auto w-20 bg-none" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="flex-col w-full bg-white p-5 rounded-md">
          {/* Header Surah */}
          <Link to={'/'}>
            <IoHome className="text-2xl opacity-50" />
          </Link>
          <h1 className="text-xl text-center font-medium">{surah.name.transliteration.id}</h1>
          <p className="font-[Amiri] text-2xl text-center">{surah.name.short}</p>
          <hr />
          <p className="mb-20 text-center opacity-50">
            Surah ke-{surah.number} | {surah.numberOfVerses} Ayat
          </p>
          {/* Daftar Ayat */}
          <div className="mt-5">
            {surah.verses.map((verse, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-10 items-center">
                  <p className="">{i + 1}</p>
                  <div className="flex gap-5">
                    {/* Tombol Play / Pause */}
                    <button
                      onClick={() => togglePlayPause(i, verse.audio.primary)} // Pass URL audio untuk ayat ini
                      className="opacity-50"
                    >
                      {playing === i ? (
                        <FaPause className="text-xl" /> // Tampilkan Pause jika sedang diputar
                      ) : (
                        <FaPlay className="text-xl" /> // Tampilkan Play jika tidak diputar
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-right font-[Amiri] text-2xl">{verse.text.arab}</p>
                <p className="text-right opacity-70">{verse.text.transliteration.en}</p>
                <p className="text-right mt-2">{verse.translation.id}</p>
                <hr className="my-3" />
              </div>
            ))}
          </div>
        </div>
        <footer className="footer footer-center bg-emerald-400 text-base-content p-4">
          <aside className='text-center'>
            <p className='font-medium'>Made With ❤️ By Rhakelino</p>
          </aside>
        </footer>
      </div>
    </div>
  );
}

export default SurahDetail;

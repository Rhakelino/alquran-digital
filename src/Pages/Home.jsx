import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";

function Home() {
    const [surahs, setSurah] = useState([]); // Data asli
    const [filteredSurahs, setFilteredSurahs] = useState([]); // Data setelah filter
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState(''); // State untuk pencarian
    const [isDarkMode, setIsDarkMode] = useState(false); // State untuk mode gelap

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('https://api.quran.gading.dev/surah');
                setSurah(response.data.data);
                setFilteredSurahs(response.data.data); // Inisialisasi data yang difilter
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error); // Tangani error jika terjadi
            }
        };
        getData();

        // Memeriksa apakah mode gelap disimpan di localStorage
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setIsDarkMode(savedMode === 'true');
        }
    }, []);

    // Fungsi untuk menangani pencarian
    const handleSearch = (event) => {
        const text = event.target.value;
        setSearchText(text); // Perbarui teks pencarian
        const filtered = surahs.filter(surah =>
            surah.name.transliteration.id.toLowerCase().includes(text.toLowerCase()) || // Filter nama transliterasi
            surah.name.translation.id.toLowerCase().includes(text.toLowerCase()) || // Filter nama terjemahan
            surah.number.toString().includes(text) // Filter berdasarkan nomor surah
        );
        setFilteredSurahs(filtered); // Perbarui data yang difilter
    };

    // Fungsi untuk mengubah mode
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

    return (
        <div className={`flex justify-center items-center ${modeClass}`}>
            <div className="w-full max-w-3xl">
                <div className={`flex-col w-full p-5 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                    <h1 className='my-5 opacity-50'>Al Quran</h1>
                    <div className="flex justify-between">
                        <h2 className='text-2xl font-medium mb-5'>Daftar Surah</h2>
                        <div className="flex">
                            <button onClick={toggleMode}>
                                {isDarkMode ? <CiLight className='text-3xl' /> : <CiDark className='text-3xl' />}
                            </button>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearch} // Tambahkan handler pencarian
                        className="w-full bg-[#F1F5F9] rounded-full py-2 px-3 placeholder:opacity-50 focus:outline-emerald-200 text-black"
                        placeholder='Cari Surah'
                    />
                    {
                        loading ? (
                            <img src="/img/loading.png" className='mx-auto w-20' alt="Loading..." />
                        ) : (
                            filteredSurahs.length > 0 ? (
                                filteredSurahs.map((surah, i) => (
                                    <Link to={`./surah/${surah.number}`} key={i}>
                                        <div className="flex items-center py-4 gap-4 border-b border-slate-200">
                                            <p className='font-medium mb-4'>{surah.number}</p>
                                            <div className="flex w-full justify-between items-center">
                                                <div className="flex w-full flex-col">
                                                    <p className='font-medium'>{surah.name.transliteration.id}</p>
                                                    <p className='opacity-50'>{surah.name.translation.id}</p>
                                                </div>
                                                <div className="flex">
                                                    <span className='text-xl font-[Amiri]'>{surah.name.short}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center opacity-50 mt-5">Nama Surah Tidak Ditemukan</p>
                            )
                        )
                    }
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

export default Home;

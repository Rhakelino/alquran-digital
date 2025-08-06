import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";

function Home() {
    const [surahs, setSurah] = useState([]);
    const [filteredSurahs, setFilteredSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('https://api.quran.gading.dev/surah');
                setSurah(response.data.data);
                setFilteredSurahs(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getData();

        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setIsDarkMode(savedMode === 'true');
        }
    }, []);

    const handleSearch = (event) => {
        const text = event.target.value;
        setSearchText(text);
        const filtered = surahs.filter(surah =>
            surah.name.transliteration.id.toLowerCase().includes(text.toLowerCase()) ||
            surah.name.translation.id.toLowerCase().includes(text.toLowerCase()) ||
            surah.number.toString().includes(text)
        );
        setFilteredSurahs(filtered);
    };

    const toggleMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', newMode.toString());
            return newMode;
        });
    };

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
    md:rounded-xl shadow-2xl p-6 
    ${isDarkMode
                        ? 'bg-black text-gray-300 border border-[#1E2330]'
                        : 'bg-white text-gray-800'
                    } 
    transition-all duration-300
`}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className={`
                                text-md font-bold 
                                ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                            `}>
                                Al Quran
                            </h1>
                            <h2 className={`
                                text-2xl font-semibold 
                                ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
                            `}>
                                Daftar Surah
                            </h2>
                        </div>
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

                    {/* Search Input */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={searchText}
                            onChange={handleSearch}
                            className={`
                                w-full py-3 px-4 pl-10 rounded-xl 
                                ${isDarkMode
                                    ? 'bg-neutral-800 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600'
                                    : 'bg-gray-200 text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-blue-500'
                                } 
                                transition-all duration-300
                            `}
                            placeholder='Cari Surah'
                        />
                        <FaSearch className={`
                            absolute left-3 top-1/2 -translate-y-1/2 
                            ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}
                        `} />
                    </div>

                    {/* Surah List */}
                    <div className="space-y-2">
                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <img src="/img/loading.png" className='w-20' alt="Loading..." />
                            </div>
                        ) : (
                            filteredSurahs.length > 0 ? (
                                filteredSurahs.map((surah, i) => (
                                    <Link
                                        to={`./surah/${surah.number}`}
                                        key={i}
                                        className={`
                                            block rounded-lg py-4 
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`
                                                    w-10 h-10 rounded-full flex items-center justify-center 
                                                    ${isDarkMode
                                                        ? 'bg-neutral-800 text-gray-300'
                                                        : 'bg-gray-200 text-gray-700'
                                                    }
                                                `}>
                                                    {surah.number}
                                                </div>
                                                <div>
                                                    <p className={`
                                                        font-medium 
                                                        ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}
                                                    `}>
                                                        {surah.name.transliteration.id}
                                                    </p>
                                                    <p className={`
                                                        text-sm 
                                                        ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}
                                                    `}>
                                                        {surah.name.translation.id}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`
                                                text-xl font-[Amiri] 
                                                ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                                            `}>
                                                {surah.name.short}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className={`
                                    text-center py-4 
                                    ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}
                                `}>
                                    Nama Surah Tidak Ditemukan
                                </p>
                            )
                        )}
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

export default Home;
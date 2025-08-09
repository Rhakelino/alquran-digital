import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuran, FaSearch, FaClock, FaMosque, FaCog } from 'react-icons/fa';
import { CiDark, CiLight } from 'react-icons/ci';

function MainMenu() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }
  }, []);

  // Save dark mode preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    
    // Optional: Add class to body for global dark mode styling
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const menuItems = [
    { 
      title: 'Baca Qur\'an', 
      icon: <FaQuran />, 
      action: () => navigate('/quran') 
    },
    { 
      title: 'Terakhir Baca', 
      icon: <FaClock />, 
      action: () => navigate('/last-read') 
    },
    { 
      title: 'Pencarian', 
      icon: <FaSearch />, 
      action: () => navigate('/search') 
    },
    { 
      title: 'Jadwal Sholat', 
      icon: <FaMosque />, 
      action: () => navigate('/prayer-times') 
    },
    { 
      title: 'Pengaturan', 
      icon: <FaCog />, 
      action: () => navigate('/settings') 
    }
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div 
      className={`
        min-h-screen 
        ${isDarkMode 
          ? 'bg-gradient-to-br from-[#1E1E1E] to-black text-gray-200' 
          : 'bg-gradient-to-br from-gray-100 to-white text-gray-800'
        } 
        flex flex-col items-center justify-center
        relative
        transition-colors duration-300
      `}
    >
      {/* Arabic Calligraphy Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            repeating-linear-gradient(
              45deg, 
              rgba(0,0,0,0.05) 0, 
              rgba(0,0,0,0.05) 1px, 
              transparent 1px, 
              transparent 15px
            )
          `,
          backgroundSize: '30px 30px, 60px 60px',
        }}
      />

      {/* Logo */}
      <div className="mb-8 z-10 text-center">
        <img 
          src="./icon-512x512.png" 
          alt="Quran Logo" 
          className="w-28 mx-auto mb-4 rounded-full shadow-md"
        />
        <h1 
          className={`
            text-2xl font-bold 
            ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}
          `}
        >
          Al-Qur'an Digital
        </h1>
      </div>

      {/* Menu Items */}
      <div className="w-full max-w-md px-6 z-10">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`
              w-full py-4 mb-4 rounded-lg flex items-center justify-center
              transition-all duration-300 
              ${isDarkMode 
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:scale-[1.02]' 
                : 'bg-white text-gray-800 shadow-md hover:bg-gray-100 hover:scale-[1.02]'
              }
              transform active:scale-95
            `}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            {item.title}
          </button>
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={toggleDarkMode}
          className={`
            p-2 rounded-full flex items-center justify-center
            transition-all duration-300
            ${isDarkMode 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }
          `}
        >
          {isDarkMode ? <CiLight className="text-2xl" /> : <CiDark className="text-2xl" />}
        </button>
      </div>

      {/* Footer */}
      <footer 
        className={`
          absolute bottom-4 w-full text-center
          ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}
        `}
      >
        <p className="text-sm">© 2024 Al-Qur'an Digital</p>
      </footer>
    </div>
  );
}

export default MainMenu;
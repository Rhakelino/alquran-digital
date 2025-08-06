import React, { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Deteksi perangkat iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Handler untuk prompt instalasi
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('Aplikasi akan dipasang');
        } else {
          console.log('Instalasi dibatalkan');
        }
        
        setShowBanner(false);
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Instalasi gagal:', error);
      }
    }
  };

  const handleIOSInstall = () => {
    alert(`Untuk install di iOS:
1. Tekan tombol share (↗️)
2. Gulir dan pilih "Tambahkan ke Layar Utama"
3. Klik "Tambah"
`);
  };

  if (!showBanner) return null;

  return (
    <div className={`
      fixed top-0 left-0 right-0 
      bg-black/80 backdrop-blur-sm
      text-white 
      p-3 
      flex justify-between items-center 
      z-50
    `}>
      <span className="text-sm">
        {isIOS 
          ? "Ingin menggunakan aplikasi di iOS?" 
          : "Ingin menggunakan aplikasi offline?"}
      </span>
      <button 
        onClick={isIOS ? handleIOSInstall : handleInstallClick}
        className="
          bg-blue-600 
          text-white 
          px-3 py-1 
          rounded-full 
          text-sm
          hover:bg-blue-700 
          transition-colors
        "
      >
        {isIOS ? 'Petunjuk Install' : 'Pasang Sekarang'}
      </button>
    </div>
  );
};

export default InstallPWA;
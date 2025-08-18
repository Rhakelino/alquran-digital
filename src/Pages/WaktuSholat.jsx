import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  FaMosque,
  FaClock,
  FaSpinner,
  FaMapMarkerAlt,
  FaSync,
  FaExclamationTriangle
} from 'react-icons/fa';

const JadwalSholat = () => {
  // State untuk lokasi dan jadwal
  const [lokasi, setLokasi] = useState({
    kota: 'Memuat Lokasi...',
    latitude: null,
    longitude: null
  });
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk jam digital
  const [waktuSekarang, setWaktuSekarang] = useState(new Date());

  // Update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setWaktuSekarang(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format waktu digital
  const formatWaktu = (date) => {
    return date.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    });
  };

  // Fungsi untuk mengambil jadwal sholat
const fetchJadwalSholat = useCallback(async (lat, lon) => {
  setLoading(true);
  setError(null);

  try {
    // Properly format the date
    const tanggal = new Date();
    const formattedDate = tanggal.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Gunakan metode Kemenag (Egypt method)
    const method = 5; // Egyptian General Authority of Survey

    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${lat}&longitude=${lon}&method=${method}`
    );

    if (!response.ok) {
      throw new Error('Gagal mengambil jadwal sholat');
    }

    const result = await response.json();
    
    // Optional: Tambahkan perhitungan manual untuk penyesuaian lokal
    const jadwalOriginal = result.data.timings;
    
    // Contoh penyesuaian manual (opsional)
    const jadwalAdjusted = {
      ...jadwalOriginal,
      // Contoh: Penyesuaian waktu sholat berdasarkan local wisdom
      // Anda bisa menambahkan offset atau penyesuaian khusus di sini
      // Misalnya: 
      // Fajr: tambahkan atau kurangi beberapa menit
      // Dhuhr: sesuaikan dengan kondisi lokal
    };

    setJadwal(jadwalAdjusted);
    setLoading(false);
  } catch (err) {
    setError('Gagal mengambil jadwal sholat: ' + err.message);
    setLoading(false);
  }
}, []);

  // Fungsi untuk mendapatkan lokasi saat ini
  const handleUpdateLokasi = useCallback(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLokasi = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            kota: 'Lokasi Saat Ini'
          };

          try {
            // Ambil nama kota
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLokasi.latitude}&lon=${newLokasi.longitude}&accept-language=id`
            );
            const data = await response.json();

            // Coba berbagai properti untuk nama kota
            newLokasi.kota =
              data.address.city ||
              data.address.town ||
              data.address.municipality ||
              data.address.county ||
              'Lokasi Tidak Dikenal';

            console.log('Lokasi Terdeteksi:', newLokasi);

            setLokasi(newLokasi);
            await fetchJadwalSholat(newLokasi.latitude, newLokasi.longitude);
          } catch (err) {
            console.error('Gagal mendapatkan lokasi:', err);
            setError('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error geolokasi:', error);
          setError('Izin lokasi ditolak. Aktifkan GPS dan coba lagi.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolokasi tidak didukung di perangkat ini');
      setLoading(false);
    }
  }, [fetchJadwalSholat]);

  // Ambil lokasi dan jadwal saat komponen dimuat
  useEffect(() => {
    handleUpdateLokasi();
  }, [handleUpdateLokasi]);

  // Daftar waktu sholat
  const waktuSholat = [
    { nama: 'Subuh', key: 'Fajr', icon: '🌅' },
    { nama: 'Dzuhur', key: 'Dhuhr', icon: '☀️' },
    { nama: 'Ashar', key: 'Asr', icon: '🌤️' },
    { nama: 'Maghrib', key: 'Maghrib', icon: '🌆' },
    { nama: 'Isya', key: 'Isha', icon: '🌙' }
  ];

  // State loading
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
    </div>
  );

  // State error
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <div className="flex items-center">
        <FaExclamationTriangle className="mr-2" />
        {error}
        <button
          onClick={handleUpdateLokasi}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-700 text-white p-6">
          <div className="flex items-center justify-center mb-2">
            <FaMosque className="mr-2 text-2xl" />
            <h1 className="text-2xl font-bold text-white">Jadwal Sholat</h1>
          </div>
          <div className="flex items-center justify-center">
            <FaMapMarkerAlt className="mr-2" />
            <span className="text-white font-medium">{lokasi.kota}</span>
          </div>

          {/* Jam Digital */}
          <div className="text-center mt-4 text-sm text-gray-300">
            {formatWaktu(waktuSekarang)}
          </div>
        </div>

        {/* Tombol Refresh */}
        <div className="p-4 text-center">
          <button
            onClick={handleUpdateLokasi}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center mx-auto hover:bg-gray-700 transition-colors"
          >
            <FaSync className="mr-2" /> Perbarui Lokasi
          </button>
        </div>

        {/* Jadwal Sholat */}
        <div className="p-4 space-y-3">
          {waktuSholat.map((sholat) => (
            <div
              key={sholat.nama}
              className="flex justify-between items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{sholat.icon}</span>
                <span className="text-white font-medium">{sholat.nama}</span>
              </div>
              <span className="font-bold text-blue-300">
                {jadwal ? jadwal[sholat.key].split(' ')[0] : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JadwalSholat;
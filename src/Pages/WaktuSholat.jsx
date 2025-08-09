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
    kota: 'Padang',
    latitude: -0.9470,  // Koordinat Padang
    longitude: 100.4232
  });
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(false);
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
      const tanggal = new Date();
      const bulan = tanggal.getMonth() + 1;
      const tahun = tanggal.getFullYear();

      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/${tahun}/${bulan}?latitude=${lat}&longitude=${lon}&method=2`
      );

      if (!response.ok) {
        throw new Error('Gagal mengambil jadwal sholat');
      }

      const result = await response.json();
      const hariIni = tanggal.getDate() - 1;
      setJadwal(result.data[hariIni].timings);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Fungsi untuk mendapatkan lokasi saat ini
  const handleUpdateLokasi = useCallback(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
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
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLokasi.latitude}&lon=${newLokasi.longitude}`
            );
            const data = await response.json();
            newLokasi.kota = data.address.city || data.address.town || 'Lokasi Tidak Dikenal';

            setLokasi(newLokasi);
            await fetchJadwalSholat(newLokasi.latitude, newLokasi.longitude);
          } catch (err) {
            setError('Gagal mendapatkan lokasi');
            setLoading(false);
          }
        },
        (error) => {
          setError('Izin lokasi ditolak');
          setLoading(false);
        }
      );
    } else {
      setError('Geolokasi tidak didukung');
    }
  }, [fetchJadwalSholat]);

  // Ambil jadwal sholat saat komponen dimuat
  useEffect(() => {
    fetchJadwalSholat(lokasi.latitude, lokasi.longitude);
  }, [lokasi, fetchJadwalSholat]);

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
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-center mb-2">
            <FaMosque className="mr-2 text-2xl" />
            <h1 className="text-2xl font-bold text-white">Jadwal Sholat</h1>
          </div>
          <div className="flex items-center justify-center">
            <FaMapMarkerAlt className="mr-2" />
            <span className="text-white font-medium">{lokasi.kota}</span>
          </div>
          
          {/* Jam Digital */}
          <div className="text-center mt-4 text-sm text-blue-100">
            {formatWaktu(waktuSekarang)}
          </div>
        </div>

        {/* Tombol Refresh */}
        <div className="p-4 text-center">
          <button 
            onClick={handleUpdateLokasi}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center mx-auto hover:bg-blue-600 transition-colors"
          >
            <FaSync className="mr-2" /> Perbarui Lokasi
          </button>
        </div>

        {/* Jadwal Sholat */}
        <div className="p-4 space-y-3">
          {waktuSholat.map((sholat) => (
            <div 
              key={sholat.nama} 
              className="flex justify-between items-center bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{sholat.icon}</span>
                <span className="text-gray-800 font-medium">{sholat.nama}</span>
              </div>
              <span className="font-bold text-blue-700">
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
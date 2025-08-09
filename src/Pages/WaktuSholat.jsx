import React, { useState, useEffect } from 'react';
import { FaMosque, FaClock, FaSpinner, FaMapMarkerAlt, FaSync } from 'react-icons/fa';

const JadwalSholat = () => {
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [izinLokasi, setIzinLokasi] = useState(false);
  const [lokasi, setLokasi] = useState({
    latitude: -6.2088,  // Default Jakarta
    longitude: 106.8456,
    kota: 'Jakarta'
  });

  // Fungsi untuk mengambil nama kota berdasarkan koordinat
  const getCityName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.address.city || data.address.town || data.address.village || 'Lokasi Tidak Dikenal';
    } catch (err) {
      console.error('Gagal mendapatkan nama kota:', err);
      return 'Lokasi Tidak Dikenal';
    }
  };

  // Fungsi utama untuk mengambil jadwal sholat
  const fetchJadwalSholat = async (lat, lon) => {
    try {
      setLoading(true);
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
      
      // Dapatkan nama kota
      const namakota = await getCityName(lat, lon);
      setLokasi(prev => ({
        ...prev,
        kota: namakota
      }));

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fungsi untuk mendapatkan lokasi
  const handleLokasi = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLokasi = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          setLokasi(prev => ({
            ...prev,
            ...newLokasi
          }));
          
          setIzinLokasi(true);
          await fetchJadwalSholat(newLokasi.latitude, newLokasi.longitude);
        },
        (error) => {
          console.warn(`Geolocation error: ${error.message}`);
          setIzinLokasi(false);
          setError('Izin lokasi ditolak. Menggunakan lokasi default.');
          fetchJadwalSholat(lokasi.latitude, lokasi.longitude);
        }
      );
    } else {
      setError("Browser Anda tidak mendukung lokasi");
      fetchJadwalSholat(lokasi.latitude, lokasi.longitude);
    }
  };

  // Effect untuk memuat data awal
  useEffect(() => {
    handleLokasi();
  }, []);

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
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 md:p-6">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen md:rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <div className="flex justify-center items-center mb-2">
            <FaMosque className="mr-2 text-2xl" />
            <h1 className="text-2xl font-bold">Jadwal Sholat</h1>
          </div>
          
          {/* Lokasi */}
          <div className="flex justify-center items-center">
            <FaMapMarkerAlt className="mr-2" />
            <span className="text-sm">{lokasi.kota}</span>
          </div>
        </div>

        {/* Peringatan Izin Lokasi */}
        {!izinLokasi && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">Izin Lokasi</p>
            <p>Mohon izinkan akses lokasi untuk mendapatkan jadwal sholat yang akurat.</p>
          </div>
        )}

        {/* Tombol Refresh Lokasi */}
        <div className="p-4 text-center">
          <button 
            onClick={handleLokasi}
            className="flex items-center justify-center mx-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <FaSync className="mr-2" />
            Perbarui Lokasi
          </button>
        </div>

        {/* Daftar Waktu Sholat */}
        <div className="p-6 space-y-4">
          {waktuSholat.map((sholat) => (
            <div 
              key={sholat.nama} 
              className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-4">{sholat.icon}</span>
                <span className="font-semibold text-gray-700">
                  {sholat.nama}
                </span>
              </div>
              <div className="flex items-center text-blue-600">
                <FaClock className="mr-2" />
                <span className="font-bold">
                  {jadwal ? jadwal[sholat.key].split(' ')[0] : '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JadwalSholat;
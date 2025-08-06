import React from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 text-center max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-4 animate-bounce">
            404
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            Halaman yang Anda cari tidak ditemukan
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-800">
              Mungkin halaman telah dipindahkan atau tidak tersedia.
            </p>
          </div>

          <Link 
            to="/" 
            className="
              flex items-center justify-center 
              w-full py-3 
              bg-blue-600 text-white 
              rounded-lg 
              hover:bg-blue-700 
              transition-colors 
              duration-300 
              group
            "
          >
            <IoHome className="mr-2 group-hover:animate-bounce" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Dekorasi tambahan */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-float2"></div>
      </div>
    </div>
  );
}

export default NotFound;
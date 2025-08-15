import React from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';
import { FaSearchMinus } from 'react-icons/fa';
import { MdErrorOutline} from 'react-icons/md';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] p-4">
      <div 
        className="
          bg-[#1E1E1E] 
          border border-[#2C2C2C] 
          shadow-2xl 
          rounded-2xl 
          p-8 
          md:p-12 
          text-center 
          max-w-md 
          w-full 
          relative 
          overflow-hidden
        "
      >
        {/* Efek glow */}
        <div 
          className="
            absolute 
            -top-20 
            -left-20 
            w-64 
            h-64 
            bg-purple-600 
            rounded-full 
            opacity-20 
            blur-3xl
          "
        ></div>

        <div className="relative z-10 mb-6">
          <div className="flex justify-center mb-4">
            <MdErrorOutline
              className="
                text-6xl 
                text-purple-500 
                animate-pulse
              " 
            />
          </div>
          <h1 
            className="
              text-4xl 
              md:text-6xl 
              font-bold 
              text-gray-100 
              mb-4
            "
          >
            404
          </h1>
          <p 
            className="
              text-lg 
              md:text-xl 
              text-gray-400 
              mb-6
            "
          >
            Halaman Tidak Ditemukan
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <div 
            className="
              bg-[#2C2C2C] 
              p-4 
              rounded-lg 
              border-l-4 
              border-purple-500
            "
          >
            <p 
              className="
                text-gray-300
                flex 
                items-center 
                justify-center
                space-x-2
              "
            >
              <FaSearchMinus className="text-purple-500" />
              <span>Url yang Anda cari tidak tersedia</span>
            </p>
          </div>

          <div 
            className="
              bg-[#2C2C2C] 
              p-4 
              rounded-lg 
              text-gray-400
              text-sm
            "
          >
            Beberapa kemungkinan:
            <ul className="list-disc list-inside mt-2">
              <li>Link mungkin salah</li>
              <li>Halaman telah dihapus</li>
              <li>Url tidak valid</li>
            </ul>
          </div>

          <Link 
            to="/" 
            className="
              flex 
              items-center 
              justify-center 
              w-full 
              py-3 
              bg-[#2C2C2C] 
              text-gray-200 
              rounded-lg 
              hover:bg-[#3C3C3C] 
              transition-colors 
              duration-300 
              group
            "
          >
            <IoHome 
              className="
                mr-2 
                text-xl 
                text-gray-400 
                group-hover:text-white 
                group-hover:animate-bounce
              " 
            />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Dekorasi tambahan */}
        <div 
          className="
            absolute 
            bottom-0 
            left-0 
            w-full 
            h-1 
            bg-gradient-to-r 
            from-transparent 
            via-purple-500 
            to-transparent
          "
        ></div>
      </div>
    </div>
  );
}

export default NotFound;
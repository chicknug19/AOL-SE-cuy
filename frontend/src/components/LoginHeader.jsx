import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between z-20 shadow-lg">
      
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-3 mb-4 md:mb-0 cursor-pointer group" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-inner transform group-hover:scale-105 transition-transform duration-200">
          <svg className="w-full h-full text-indigo-600" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" fill="white" stroke="#4F46E5" strokeWidth="3"/>
            <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
            <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
            <path d="M35 50 L65 50" stroke="#4F46E5" strokeWidth="3"/>
            <path d="M35 65 L65 65" stroke="#4F46E5" strokeWidth="3"/>
            <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#4F46E5"/>
          </svg>
        </div>
        <h1 className="font-extrabold text-base md:text-xl tracking-wide">Bookugers Library</h1>
      </div>

      {/* Right: Navigation Links */}
      <nav className="flex items-center gap-8 text-sm font-semibold">
        {/* Tombol diubah menjadi Explore dan mengarah ke Katalog Publik */}
        <button onClick={() => navigate('/explore')} className="flex items-center gap-2 hover:text-blue-200 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explore
        </button>
        <button onClick={() => navigate('/about')} className="flex items-center gap-2 hover:text-blue-200 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About Us
        </button>
      </nav>
    </header>
  );
};

export default LoginHeader;
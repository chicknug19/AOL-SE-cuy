import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MemberHeader = ({ userData, allBooks = [] }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mendeteksi halaman aktif
  const [query, setQuery] = useState('');

  // Logika Rekomendasi Pencarian (Dipindah ke sini)
  const recommendations = query.trim() === '' ? [] : allBooks
    .filter(b => b.judul.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.judul.localeCompare(b.judul))
    .slice(0, 5);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fungsi pembantu untuk memberikan warna biru pada menu yang sedang aktif
  const getNavClass = (path) => {
    return location.pathname === path 
      ? "text-[#3B82F6] font-bold" 
      : "text-gray-500 hover:text-[#3B82F6] font-semibold transition-colors";
  };

  // --- FUNGSI NAVIGASI PENCARIAN ---
  const handleSearchSubmit = () => {
    if (query.trim() !== '') {
      navigate(`/search?q=${query}`);
    } else {
      navigate('/search'); // Pergi ke halaman search meskipun input kosong
    }
    setQuery(''); // Kosongkan kotak setelah mencari/berpindah
  };

  return (
    <header className="bg-white py-3 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-50">
      
      {/* KIRI: Logo & Navigasi */}
      <div className="flex items-center gap-8 mb-4 md:mb-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-sm border border-gray-100">
            <svg className="w-full h-full text-[#38A169]" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="white" stroke="#38A169" strokeWidth="3"/>
              <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
              <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
              <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#38A169"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-gray-900">Bookugers</h1>
            <p className="text-[10px] text-gray-500">University Library System</p>
          </div>
        </div>

        {/* Menu Navigasi (Sembunyi di HP, muncul di layar besar) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm ml-4">
          <button onClick={() => navigate('/')} className={getNavClass('/')}>Home</button>
          <button onClick={() => navigate('/explore')} className={getNavClass('/explore')}>Explore</button>
          <button onClick={() => navigate('/about')} className={getNavClass('/about')}>About Us</button>
        </nav>
      </div>

      {/* TENGAH: Search Bar & Rekomendasi */}
      <div className="relative w-full max-w-md mb-4 md:mb-0">
        <div className="w-full bg-white rounded-full flex items-center px-4 py-2 shadow-sm border border-gray-200 focus-within:border-blue-400 transition-colors">
          <svg 
            onClick={handleSearchSubmit}
            className="w-4 h-4 text-gray-500 flex-shrink-0 cursor-pointer hover:text-blue-500 transition-colors" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search for books, authors, or topics" 
            className="w-full bg-transparent outline-none border-none ml-3 text-gray-700 placeholder-gray-400 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
          />
        </div>

        {recommendations.length > 0 && (
          <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50">
            {recommendations.map(book => (
              <div 
                key={book.id}
                onClick={() => {
                  navigate(`/search?q=${book.judul}`);
                  setQuery('');
                }}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-800 border-b border-gray-100 last:border-0 flex items-center gap-3 font-semibold transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="truncate">{book.judul}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KANAN: Profil & Logout */}
      <div className="text-right flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-[11px] text-gray-500">Welcome Back,</span>
          <span className="font-bold text-gray-900 text-sm">{userData?.nama || "Member"}</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>

    </header>
  );
};

export default MemberHeader;
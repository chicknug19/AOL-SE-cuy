import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Mendeteksi URL saat ini

  // Fungsi untuk mengecek apakah menu sedang aktif
  const isActive = (path) => location.pathname === path;

  // Kelas CSS dasar untuk menu
  const baseClass = "flex items-center gap-3 px-6 py-3 text-sm font-semibold border-l-4 text-left w-full transition-colors";
  const activeClass = "border-black bg-gray-50 text-black";
  const inactiveClass = "border-transparent text-gray-500 hover:text-black hover:bg-gray-50";

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem('token');
    navigate('/admin');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h2 className="font-bold text-sm tracking-wide text-black">Library Admin</h2>
      </div>
      
      <nav className="flex flex-col py-4">
        <button onClick={() => navigate('/admin/dashboard')} className={`${baseClass} ${isActive('/admin/dashboard') ? activeClass : inactiveClass}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Dashboard
        </button>
        
        <div className="w-full h-px bg-gray-200 my-1"></div>
        
        <button onClick={() => navigate('/admin/borrow')} className={`${baseClass} ${isActive('/admin/borrow') ? activeClass : inactiveClass}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Borrow Books
        </button>
        
        <div className="w-full h-px bg-gray-200 my-1"></div>
        
        <button onClick={() => navigate('/admin/return')} className={`${baseClass} ${isActive('/admin/return') ? activeClass : inactiveClass}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          Return Books
        </button>
        
        <div className="w-full h-px bg-gray-200 my-1"></div>
        
        <button onClick={() => navigate('/admin/members')} className={`${baseClass} ${isActive('/admin/members') ? activeClass : inactiveClass}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          Members
        </button>
        
        <div className="w-full h-px bg-gray-200 my-1"></div>
        
        <button onClick={() => navigate('/admin/catalog')} className={`${baseClass} ${isActive('/admin/catalog') ? activeClass : inactiveClass}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Catalogs
        </button>
      </nav>
      
      <div className="mt-auto p-4">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 font-semibold py-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
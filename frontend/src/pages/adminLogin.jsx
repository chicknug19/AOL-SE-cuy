import React from 'react';
import loginBg from '../assets/login_bg.png';

const AdminLogin = ({ onLogin, onUserClick }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="bg-[#C1272D] py-3 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between shadow-md z-10 relative">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-sm">
            <svg className="w-full h-full text-[#38A169]" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="white" stroke="#38A169" strokeWidth="3"/>
              <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
              <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
              <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#38A169"/>
            </svg>
          </div>
          <h1 className="font-bold text-lg text-white tracking-wide">Bookugers Library Management</h1>
        </div>

        <nav className="flex items-center gap-6 text-white text-xs font-semibold">
          <a href="#" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Home
          </a>
          <a href="#" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            About Us
          </a>
          <a href="#" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            Contact
          </a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-grow flex flex-col items-center justify-center py-12 md:py-20 px-4">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img src={loginBg} alt="Library Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20"></div> {/* Optional dark overlay for better text readability */}
        </div>

        {/* Welcome Text */}
        <div className="relative z-10 text-center text-gray-900 mb-8 drop-shadow-md bg-white/70 backdrop-blur-sm p-4 rounded-xl">
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Welcome to Bookuger</h2>
          <p className="text-sm font-semibold text-gray-800">Your gateway to endless reading adventures.</p>
        </div>

        {/* Login Form Card */}
        <div className="relative z-10 w-full max-w-md bg-white shadow-2xl rounded-sm overflow-hidden">
          
          <div className="py-4 text-center">
            <h3 className="text-xl font-bold text-black tracking-wide">Admin Login</h3>
          </div>
          
          <div className="w-full h-0.5 bg-black mb-6"></div>

          <form className="flex flex-col gap-5 px-8 pb-8" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#C1272D] focus:ring-1 focus:ring-[#C1272D] transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black">Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                required
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#C1272D] focus:ring-1 focus:ring-[#C1272D] transition-colors"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" id="remember" className="w-3.5 h-3.5 text-[#C1272D] rounded border-gray-300 focus:ring-[#C1272D] cursor-pointer" />
              <label htmlFor="remember" className="text-xs text-black font-semibold cursor-pointer">Remember Me</label>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              className="w-full bg-black text-white font-bold text-sm py-3 mt-2 rounded hover:bg-gray-800 transition-colors tracking-wide"
            >
              Sign In
            </button>

            {/* Links */}
            <div className="flex flex-col items-center gap-3 mt-2">
              <a href="#" className="text-xs text-black font-bold hover:underline">Forgot Password</a>
              <button type="button" onClick={onUserClick} className="text-xs text-gray-500 font-semibold hover:text-black transition-colors mt-2">
                Login as User instead
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#C1272D] py-10 px-8 md:px-16 flex flex-col md:flex-row justify-between gap-10 md:gap-4 relative z-10">
        {/* ... Footer Content (Truncated for brevity, reusing same as login.jsx) */}
        <div className="flex flex-col max-w-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5">
                <svg className="w-full h-full text-[#38A169]" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="45" fill="white" stroke="#38A169" strokeWidth="3"/>
                  <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
                  <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
                  <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#38A169"/>
                </svg>
             </div>
          </div>
          <h3 className="text-white font-bold text-lg leading-tight">Bookugers Library Management</h3>
          <p className="text-white/90 text-xs mt-1 max-w-[200px]">Your Gateway To Endless Reading Adventures.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3 text-white/90 text-[10px]">
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <p>Jl. Jalur Sutera Barat Kav. 21, Alam Sutera,<br/>Panunggangan Tim., Pinang, Kota Tangerang, Banten<br/>15143</p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <p>+62 821-2623-6628</p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <p>Bookugers@binus.ac.id</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Follow Us</h4>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
              <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </div>
              <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;

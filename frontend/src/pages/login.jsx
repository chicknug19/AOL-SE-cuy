import React, { useState } from 'react';
import loginBg from '../assets/login_bg.png';

const Login = ({ onLogin, onAdminClick }) => {
  // State untuk menyimpan input user
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  
  // State untuk menyimpan pesan error
  const [errors, setErrors] = useState({ nim: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error state setiap kali submit
    let newErrors = { nim: '', password: '' };
    let isValid = true;

    // Validasi NIM: Harus angka dan tepat 10 digit
    const nimRegex = /^\d{10}$/;
    if (!nim || !nimRegex.test(nim)) {
      newErrors.nim = "Please enter a valid 10-digit NIM.";
      isValid = false;
    }

    // Validasi Password: Harus sesuai dengan NIM (Simulasi Frontend)
    // Catatan: Jika menggunakan AJAX/API ASP.NET, logika fetch ditaruh di blok ini
    if (isValid && password !== nim) {
      newErrors.password = "Incorrect password.";
      isValid = false;
    }

    setErrors(newErrors);

    // Jika semua validasi lolos, jalankan fungsi login
    if (isValid) {
      onLogin();
    }
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      
      {/* Top Header */}
      <header className="w-full bg-[#C1272D] text-white py-3 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between z-20 shadow-md">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <svg className="w-full h-full text-[#38A169]" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="white" stroke="#38A169" strokeWidth="3"/>
              <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
              <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
              <path d="M35 50 L65 50" stroke="#38A169" strokeWidth="3"/>
              <path d="M35 65 L65 65" stroke="#38A169" strokeWidth="3"/>
              <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#38A169"/>
            </svg>
          </div>
          <h1 className="font-bold text-base md:text-lg">Bookugers Library Management</h1>
        </div>

        {/* Right: Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Home
          </a>
          <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            About Us
          </a>
          <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            Contact
          </a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative w-full flex-grow flex flex-col items-center justify-center min-h-[600px] md:min-h-[700px] py-12">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={loginBg} alt="Library Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/40"></div>
        </div>

        {/* Floating Welcome Text */}
        <div className="relative z-10 text-center text-gray-900 mb-6 mt-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Bookuger</h2>
          <p className="text-base md:text-lg font-medium text-gray-800">Your gateway to endless reading adventures.</p>
        </div>

        {/* Login Box */}
        <div className="relative z-10 bg-white w-[90%] max-w-[500px] px-8 py-10 shadow-2xl rounded-sm">
          <h2 className="text-2xl font-bold text-center text-black">Login</h2>
          
          <div className="w-full h-0.5 bg-black my-6"></div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* NIM Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-black">NIM</label>
              <input 
                type="text" 
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Enter your NIM" 
                className={`w-full border ${errors.nim ? 'border-red-500' : 'border-gray-200'} rounded px-4 py-2.5 text-sm outline-none focus:border-gray-400 placeholder-gray-400`}
              />
              {errors.nim && <span className="text-xs text-red-500 font-medium">{errors.nim}</span>}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-black">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded px-4 py-2.5 text-sm outline-none focus:border-gray-400 placeholder-gray-400`}
              />
              {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password}</span>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" id="remember" className="w-3.5 h-3.5 border-gray-300 rounded cursor-pointer" />
              <label htmlFor="remember" className="text-xs font-bold text-black cursor-pointer">Remember me</label>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <button 
                type="submit" 
                className="w-full bg-black text-white font-bold text-sm py-3 rounded hover:bg-gray-800 transition-colors tracking-wide"
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={onAdminClick}
                className="text-xs text-gray-500 font-semibold hover:text-black transition-colors mt-2"
              >
                Login as Admin instead
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center mt-2">
              <a href="#" className="text-xs font-bold text-black hover:underline">Forgot Password</a>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#C1272D] text-white pt-12 pb-6 px-8 md:px-16 z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-8">
          
          {/* Logo & Name */}
          <div className="flex flex-col items-start">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 p-1">
              <svg className="w-full h-full text-[#38A169]" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="white" stroke="#38A169" strokeWidth="3"/>
                <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
                <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
                <path d="M35 50 L65 50" stroke="#38A169" strokeWidth="3"/>
                <path d="M35 65 L65 65" stroke="#38A169" strokeWidth="3"/>
                <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#38A169"/>
              </svg>
            </div>
            <h4 className="font-bold text-lg mb-1">Bookugers Library Management</h4>
            <p className="text-xs opacity-90 max-w-[200px] leading-relaxed">Your Gateway to Endless Reading Adventures</p>
          </div>

          {/* Contact Us */}
          <div className="md:ml-8">
            <h4 className="font-bold text-sm mb-4 relative inline-block">
              Contact Us
              <div className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white"></div>
            </h4>
            <ul className="space-y-4 text-xs font-medium">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="leading-relaxed">Jl. Jalur Sutera Barat No. 17, Alam Sutera,<br/>Panunggangan, Kec. Pinang, Kota Tangerang, Banten<br/>15143</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+62 812 9999 9999</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>lntbinus@binus.edu</span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="md:ml-auto">
            <h4 className="font-bold text-sm mb-4 relative inline-block">
              Follow Us
              <div className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white"></div>
            </h4>
            <div className="flex items-center gap-3 mt-2">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center hover:bg-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center hover:bg-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 0012.67-1.48v-5.22a8.21 8.21 0 004.77 1.52v-3.4a4.83 4.83 0 01-2.85-1.03z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center hover:bg-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="max-w-6xl mx-auto pt-4 text-center">
          <p className="text-[10px] opacity-60">© 2024 Bookugers Team L. All rights reserved and together health prosperus oiu</p>
        </div>
      </footer>

    </div>
  );
};

export default Login;
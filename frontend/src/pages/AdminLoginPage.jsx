import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import loginBg from '../assets/login_bg.png';
import Footer from '../components/Footer';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  
  // State untuk form login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Sesuaikan payload dengan isi LoginAdminDto di backend
      const payload = {
        email: email,
        password: password
      };

      // 2. Tembak ke endpoint login-admin yang benar
      const response = await api.post('/auth/login-admin', payload);

      // Simpan JWT Token ke memori browser
      localStorage.setItem('token', response.data.token);
      
      // Jika berhasil, arahkan ke dashboard admin
      navigate('/admin/dashboard');
      
    } catch (error) {
      // Tangkap pesan error dari backend
      setErrorMsg(error.response?.data || 'Email atau Password salah.');
    } finally {
      setIsLoading(false);
    }
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
          <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Home
          </button>
          <button onClick={() => navigate('/about')} className="flex items-center gap-1 hover:text-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            About Us
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-grow flex flex-col items-center justify-center py-12 md:py-20 px-4">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img src={loginBg} alt="Library Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20"></div> 
        </div>

        {/* Welcome Text */}
        <div className="relative z-10 text-center text-gray-900 mb-8 drop-shadow-md bg-white/70 backdrop-blur-sm p-4 rounded-xl">
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Welcome to Bookugers</h2>
          <p className="text-sm font-semibold text-gray-800">Your gateway to endless reading adventures.</p>
        </div>

        {/* Login Form Card */}
        <div className="relative z-10 w-full max-w-md bg-white shadow-2xl rounded-sm overflow-hidden">
          
          <div className="py-4 text-center">
            <h3 className="text-xl font-bold text-black tracking-wide">Admin Login</h3>
          </div>
          
          <div className="w-full h-0.5 bg-black mb-6"></div>

          <form className="flex flex-col gap-5 px-8 pb-8" onSubmit={handleSubmit}>
            
            {/* Tampilkan pesan error jika ada */}
            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black">Email (Binus Domain)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (@binus.ac.id)" 
                required
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#C1272D] focus:ring-1 focus:ring-[#C1272D] transition-colors"
              />
            </div>

            {/* Password Input (Hanya UI statis karena pakai SSO dummy) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                required
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#C1272D] focus:ring-1 focus:ring-[#C1272D] transition-colors"
              />
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full font-bold text-sm py-3 mt-2 rounded transition-colors tracking-wide ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isLoading ? 'Processing...' : 'Sign In'}
            </button>

            {/* Links */}
            <div className="flex flex-col items-center gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => navigate('/login')} 
                className="text-xs text-gray-500 font-semibold hover:text-black transition-colors mt-2"
              >
                Login as User instead
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Memanggil Komponen Footer yang sudah dipisah */}
      <Footer />
      
    </div>
  );
};

export default AdminLoginPage;
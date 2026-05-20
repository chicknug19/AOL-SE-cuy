import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import loginBg from '../assets/login_bg.png';
import Footer from '../components/Footer';

const LoginPage = () => {
  const navigate = useNavigate();

  // State untuk menyimpan input user
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk menyimpan pesan error
  const [errors, setErrors] = useState({ nim: '', password: '', server: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    let newErrors = { nim: '', password: '', server: '' };
    let isValid = true;

    // Validasi NIM: Harus angka dan minimal 8 digit (sesuai NIM Binus)
    const nimRegex = /^\d{8,10}$/;
    if (!nim || !nimRegex.test(nim)) {
      newErrors.nim = "Please enter a valid NIM.";
      isValid = false;
    }

    // Validasi Password (Simulasi Frontend seperti kodemu sebelumnya)
    if (isValid && password !== nim) {
      newErrors.password = "Incorrect password.";
      isValid = false;
    }

    setErrors(newErrors);

    // Jika validasi lokal lolos, tembak API
    if (isValid) {
      setIsLoading(true);
      try {
        // payload login sesuai dengan endpoint SSO yang dibuat di backend
        const payload = {
          nama: `Mahasiswa ${nim}`, // Nama otomatis jika user baru
          email: `${nim}@binus.ac.id` // Email format Binus
        };

        const response = await api.post('/auth/login-sso', payload);

        // Simpan JWT Token ke memori browser
        localStorage.setItem('token', response.data.token);
        
        // Arahkan ke halaman utama/dashboard mahasiswa
        navigate('/');
        
      } catch (error) {
        setErrors({ ...newErrors, server: error.response?.data || 'Terjadi kesalahan pada server.' });
      } finally {
        setIsLoading(false);
      }
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
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Home
          </button>
          <button onClick={() => navigate('/about')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            About Us
          </button>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Bookugers</h2>
          <p className="text-base md:text-lg font-medium text-gray-800">Your gateway to endless reading adventures.</p>
        </div>

        {/* Login Box */}
        <div className="relative z-10 bg-white w-[90%] max-w-[500px] px-8 py-10 shadow-2xl rounded-sm">
          <h2 className="text-2xl font-bold text-center text-black">Login</h2>
          
          <div className="w-full h-0.5 bg-black my-6"></div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            
            {errors.server && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-xs font-semibold text-center">
                {errors.server}
              </div>
            )}

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
                disabled={isLoading}
                className={`w-full text-white font-bold text-sm py-3 rounded transition-colors tracking-wide ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
              >
                {isLoading ? 'Processing...' : 'Sign In'}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/admin')}
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

      {/* Memanggil Komponen Footer yang sudah dipisah */}
      <Footer />

    </div>
  );
};

export default LoginPage;
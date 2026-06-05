import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import loginBg from '../assets/login_bg.png';
import Footer from '../components/Footer';
import LoginHeader from '../components/LoginHeader'; // <-- Import Header yang sama dengan LoginPage Member

const AdminLoginPage = () => {
  const navigate = useNavigate();
  
  // State untuk form login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk fitur lihat password
  const [showPassword, setShowPassword] = useState(false);

  // State untuk menyimpan pesan error spesifik
  const [errors, setErrors] = useState({ email: '', password: '', server: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    let newErrors = { email: '', password: '', server: '' };
    let isValid = true;

    // Validasi Email
    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Validasi Password
    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);

    // Jika input valid, proses ke backend
    if (isValid) {
      setIsLoading(true);
      try {
        const payload = {
          email: email,
          password: password
        };

        const response = await api.post('/auth/login-admin', payload);

        // Simpan JWT Token ke memori browser
        localStorage.setItem('token', response.data.token);
        
        // Arahkan ke dashboard admin
        navigate('/admin/dashboard');
        
      } catch (error) {
        setErrors({ 
          ...newErrors, 
          server: error.response?.data || 'Incorrect Email or Password.' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col">
      
      {/* Panggil Login Header di sini (Komponen Reusable) */}
      <LoginHeader />

      {/* Main Content Area */}
      <main className="relative w-full flex-grow flex flex-col items-center justify-center min-h-[650px] py-12">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={loginBg} alt="Library Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        </div>

        {/* Floating Text */}
        <div className="relative z-10 text-center text-white mb-8 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg tracking-tight">Login Page</h2>
          <p className="text-lg md:text-xl font-medium text-slate-200 drop-shadow-md">Authorized library personnel only.</p>
        </div>

        {/* Login Box */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md w-[90%] max-w-[420px] px-8 py-10 shadow-2xl rounded-3xl border border-white/40">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800">Admin Login</h2>
            <p className="text-sm text-slate-500 mt-2">Enter your credentials to access the dashboard</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            
            {errors.server && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold text-center shadow-sm">
                {errors.server}
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Email (Binus Domain)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {/* Email Icon */}
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="admin@binus.ac.id" 
                  className={`w-full pl-11 bg-slate-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:bg-white transition-all duration-200 placeholder-slate-400`}
                />
              </div>
              {errors.email && <span className="text-xs text-red-500 font-medium ml-1">{errors.email}</span>}
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {/* Lock Icon */}
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="Enter your password" 
                  className={`w-full pl-11 pr-12 bg-slate-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:bg-white transition-all duration-200 placeholder-slate-400`}
                />
                
                {/* Toggle Eye Icon Button */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    // Eye Slash Icon (Hide)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    // Eye Icon (Show)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500 font-medium ml-1">{errors.password}</span>}
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer transition-colors" />
                <label htmlFor="remember" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">Remember me</label>
              </div>
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')} 
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col items-center gap-4 mt-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 tracking-wide ${isLoading ? 'bg-slate-400 cursor-not-allowed shadow-none hover:translate-y-0' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </div>
                ) : 'Sign In'}
              </button>

              

              <div className="relative flex py-2 items-center w-full">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-700 transition-all duration-200"
              >
                Login as Student
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLoginPage;
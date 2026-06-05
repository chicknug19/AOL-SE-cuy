import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import loginBg from '../assets/login_bg.png';
import Footer from '../components/Footer';
import LoginHeader from '../components/LoginHeader';

const RequestResetPage = () => {
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      setErrorMsg("Please enter your NIM or Email.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Menembak endpoint forgot-password di backend Azure
      // Pastikan tidak ada garis miring '/' di awal Auth agar URL tidak terpotong
      await api.post('Auth/forgot-password', { 
        identifier: identifier 
      });

      setIsSuccess(true);
    } catch (error) {
      setErrorMsg(error.response?.data || 'Failed to send reset link. Make sure your NIM/Email is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col">
      
      <LoginHeader />

      <main className="relative w-full flex-grow flex flex-col items-center justify-center min-h-[650px] py-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={loginBg} alt="Library Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        </div>

        {/* Form Box */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md w-[90%] max-w-[420px] px-8 py-10 shadow-2xl rounded-3xl border border-white/40">
          
          {isSuccess ? (
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Check Your Email</h2>
              <p className="text-sm text-slate-500 mb-8">
                If the NIM or Email you entered is registered, we have sent a password reset link to your email address.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-indigo-600 text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-indigo-700 transition-all duration-300"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-800">Forgot Password</h2>
                <p className="text-sm text-slate-500 mt-2">Enter your NIM (Member) or Email (Admin) to receive a reset link.</p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold text-center shadow-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">NIM / Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g. 2802399614 or admin@binus.ac.id" 
                      className={`w-full pl-11 pr-4 bg-slate-50 border ${errorMsg ? 'border-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:bg-white transition-all duration-200`}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center mt-4">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-300 shadow-md tracking-wide ${isLoading ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Link...
                      </div>
                    ) : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestResetPage;
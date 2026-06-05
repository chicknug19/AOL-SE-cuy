import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import loginBg from '../assets/login_bg.png';
import Footer from '../components/Footer';
import LoginHeader from '../components/LoginHeader'; // <-- Memanggil LoginHeader

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  
  // Mengambil token rahasia dari URL (Contoh: /forgot-password?token=abc123xxx)
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token'); 

  // State untuk menyimpan input user
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State untuk loading dan pesan sukses
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // State untuk fitur show/hide password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State untuk menyimpan pesan error
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '', server: '' });

  // Validasi real-time saat mengetik Confirm Password
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value.length > 0 && value !== newPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    let newErrors = { newPassword: '', confirmPassword: '', server: '' };
    let isValid = true;

    // Pastikan URL memiliki token
    if (!resetToken) {
      newErrors.server = "Invalid or missing reset token. Please request a new password reset link.";
      setErrors(newErrors);
      return;
    }

    // Validasi Password Baru
    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
      isValid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long.";
      isValid = false;
    }

    // Validasi Konfirmasi Password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);

    // Jika validasi frontend lolos, kirim ke Backend
    if (isValid) {
      setIsLoading(true);
      try {
        const payload = {
          token: resetToken, 
          newPassword: newPassword
        };

        await api.post('Auth/reset-password', payload);

        setIsSuccess(true);
        
      } catch (error) {
        setErrors({ 
          ...newErrors, 
          server: error.response?.data || 'Failed to update password. Token might be expired.' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col">
      
      {/* Memanggil Komponen Login Header */}
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
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg tracking-tight">Account Recovery</h2>
          <p className="text-lg md:text-xl font-medium text-slate-200 drop-shadow-md">Securely regain access to your account.</p>
        </div>

        {/* Form Box */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md w-[90%] max-w-[420px] px-8 py-10 shadow-2xl rounded-3xl border border-white/40">
          
          {isSuccess ? (
            // Tampilan Jika Berhasil Mengubah Password
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Password Updated!</h2>
              <p className="text-sm text-slate-500 mb-8">Your new password has been set successfully. You can now log in with your new credentials.</p>
              
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-indigo-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Back to Login Page
              </button>
            </div>
          ) : (
            // Tampilan Form Reset Password
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-800">Reset Password</h2>
                <p className="text-sm text-slate-500 mt-2">Please enter and confirm your new password.</p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                
                {errors.server && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold text-center shadow-sm">
                    {errors.server}
                  </div>
                )}

                {/* Info Jika Token Tidak Ditemukan di URL */}
                {!resetToken && !errors.server && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-xs font-medium text-center shadow-sm">
                    Warning: No reset token found in the URL. Submission will fail.
                  </div>
                )}

                {/* New Password Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                        if (confirmPassword.length > 0 && e.target.value !== confirmPassword) {
                          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
                        } else {
                          setErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }
                      }}
                      placeholder="Enter new password" 
                      className={`w-full pl-11 pr-12 bg-slate-50 border ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:bg-white transition-all duration-200 placeholder-slate-400`}
                    />
                    
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                    >
                      {showNewPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {errors.newPassword && <span className="text-xs text-red-500 font-medium ml-1">{errors.newPassword}</span>}
                </div>

                {/* Confirm Password Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Confirm new password" 
                      className={`w-full pl-11 pr-12 bg-slate-50 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-xl px-4 py-3 text-sm outline-none focus:ring-4 focus:bg-white transition-all duration-200 placeholder-slate-400`}
                    />
                    
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="text-xs text-red-500 font-medium ml-1">{errors.confirmPassword}</span>}
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col items-center mt-4">
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
                        Updating Password...
                      </div>
                    ) : 'Update Password'}
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

export default ResetPasswordPage;
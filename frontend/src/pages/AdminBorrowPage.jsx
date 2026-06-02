import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar'; // Import Sidebar Baru

const AdminBorrowPage = ({ onLogout }) => {
  const navigate = useNavigate();

  // Satpam Virtual yang sudah dibersihkan (Tanpa menarik data dashboard)
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.nameid;

        const userRes = await api.get(`/user/${userId}`);
        if (userRes.data.role !== "Admin") {
          navigate('/');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/admin');
      }
    };

    checkAccess();
  }, [navigate]);

  // State untuk Member
  const [memberIdInput, setMemberIdInput] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [memberError, setMemberError] = useState('');

  // State untuk Cart Buku
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState([]);
  const [cartError, setCartError] = useState('');

  // State untuk Checkout
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState('');

  const handleScanMember = async () => {
    setMemberError('');
    setCheckoutSuccess('');
    if (!memberIdInput) return;

    try {
      const response = await api.get(`/user/${memberIdInput}`);
      setMemberData(response.data);
    } catch (error) {
      setMemberData(null);
      setMemberError(error.response?.data || 'Member tidak ditemukan');
    }
  };

  const handleScanBook = async () => {
    setCartError('');
    setCheckoutSuccess('');
    if (!barcodeInput) return;

    const isAlreadyInCart = cart.find(b => b.kodeBarcode === barcodeInput);
    if (isAlreadyInCart) {
      setCartError('Buku ini sudah ada di dalam keranjang.');
      return;
    }

    try {
      const response = await api.get(`/itembuku/scan/${barcodeInput}`);
      const book = response.data;

      if (book.status !== 'Tersedia') {
        setCartError(`Buku tidak bisa dipinjam. Status: ${book.status}`);
        return;
      }

      setCart([...cart, book]);
      setBarcodeInput(''); 
    } catch (error) {
      setCartError('Barcode tidak valid atau buku tidak ditemukan');
    }
  };

  const handleRemoveFromCart = (barcodeToRemove) => {
    setCart(cart.filter(book => book.kodeBarcode !== barcodeToRemove));
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    setCheckoutSuccess('');
    
    try {
      for (const book of cart) {
        await api.post('/transaksi/pinjam', {
          userId: memberData.id,
          itemBukuId: book.id
        });
      }

      setCheckoutSuccess('Transaksi berhasil! Buku siap dibawa pulang.');
      setCart([]); 
      setMemberData(null); 
      setMemberIdInput('');
    } catch (error) {
      setCartError(error.response?.data || 'Gagal memproses transaksi');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const isCheckoutReady = memberData && !memberData.isBlacklisted && cart.length > 0;

  return (
    <div className="flex w-full min-h-screen bg-[#F7F8FA] font-sans text-gray-900">
      
      {/* Panggil Sidebar di sini dengan 1 baris */}
      <AdminSidebar onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Borrow Books</h1>
          <p className="text-sm text-gray-500 font-medium">Process book borrowing transactions</p>
        </header>

        {checkoutSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
            {checkoutSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
            <h3 className="text-lg font-bold text-black mb-6">Member Information</h3>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-900 mb-2">Scan Member ID</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={memberIdInput}
                  onChange={(e) => setMemberIdInput(e.target.value)}
                  placeholder="Enter member ID (e.g., 1)" 
                  className="flex-grow border border-[#93C5FD] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 placeholder-gray-400"
                />
                <button 
                  onClick={handleScanMember}
                  className="bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
                >
                  Scan
                </button>
              </div>
              {memberError && <p className="text-red-500 text-xs mt-2 font-semibold">{memberError}</p>}
            </div>

            <div className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed ${memberData ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50/50'} rounded-xl p-8 min-h-[200px]`}>
              {!memberData ? (
                <>
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-semibold text-gray-500">Scan a member ID to view profile</p>
                </>
              ) : (
                <div className="w-full text-left">
                  <h4 className="font-bold text-lg mb-1">{memberData.nama}</h4>
                  <p className="text-sm text-gray-600 mb-4">{memberData.email}</p>
                  
                  {memberData.isBlacklisted ? (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                      BLACKLISTED - Cannot Borrow
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                      ACTIVE MEMBER
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
            <h3 className="text-lg font-bold text-black mb-6">Book Cart</h3>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-900 mb-2">Scan Book Barcode</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Enter book barcode (e.g., HP-001)" 
                  className="flex-grow border border-[#93C5FD] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 placeholder-gray-400"
                />
                <button 
                  onClick={handleScanBook}
                  className={`${barcodeInput ? 'bg-[#3B82F6] hover:bg-blue-600 cursor-pointer' : 'bg-gray-200 cursor-not-allowed'} text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors`}
                  disabled={!barcodeInput}
                >
                  Add
                </button>
              </div>
              {cartError && <p className="text-red-500 text-xs mt-2 font-semibold">{cartError}</p>}
            </div>

            <div className="flex-grow flex flex-col border border-gray-200 rounded-xl bg-white p-4 min-h-[150px] mb-6 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="m-auto text-center">
                  <p className="text-xs font-bold text-gray-500">No books in cart</p>
                </div>
              ) : (
                <ul className="w-full space-y-3">
                  {cart.map((book, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <p className="text-sm font-bold">{book.judulBuku || `Buku ID: ${book.bukuId}`}</p>
                        <p className="text-xs text-gray-500">{book.kodeBarcode}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(book.kodeBarcode)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove book"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button 
              onClick={handleCheckout}
              disabled={!isCheckoutReady || isCheckoutLoading}
              className={`w-full font-bold text-sm py-4 rounded-xl mt-auto transition-colors ${
                isCheckoutReady 
                  ? 'bg-black text-white hover:bg-gray-800 cursor-pointer' 
                  : 'bg-gray-300 text-white cursor-not-allowed'
              }`}
            >
              {isCheckoutLoading ? 'Processing...' : `Complete Checkout (${cart.length} books)`}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminBorrowPage;
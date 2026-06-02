import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';

const ReturnBooksPage = ({ onLogout }) => {
  const navigate = useNavigate();

  // Satpam Virtual
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

  // State Utama
  const [memberIdInput, setMemberIdInput] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- STATE UNTUK CUSTOM MODAL (POPUP) ---
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, itemBukuId: null, judulBuku: '' });
  const [feeModal, setFeeModal] = useState({ isOpen: false, judulBuku: '', denda: 0 });
  const [isReturning, setIsReturning] = useState(false);

  // Fungsi Penerjemah Status
  const translateStatus = (status) => {
    switch(status) {
      case 'Berjalan': return 'ACTIVE';
      case 'Selesai': return 'RETURNED';
      case 'Terlambat': return 'OVERDUE';
      default: return status ? status.toUpperCase() : 'UNKNOWN';
    }
  };

  // --- FUNGSI BARU: Hanya mengambil data dari API tanpa mereset UI ---
  const refreshMemberData = async () => {
    try {
      const userRes = await api.get(`/user/${memberIdInput}`);
      setMemberData(userRes.data);

      const trxRes = await api.get(`/transaksi/user/${memberIdInput}`);
      
      const activeBorrowings = trxRes.data.filter(
        trx => trx.statusTransaksi === 'Berjalan' || trx.statusTransaksi === 'Terlambat'
      );
      
      setBorrowedBooks(activeBorrowings);
      return { user: userRes.data, active: activeBorrowings };
    } catch (error) {
      setMemberData(null);
      setBorrowedBooks([]);
      throw error;
    }
  };

  // Fungsi Scan Member (Ditekan lewat tombol/Enter)
  const handleScanMember = async () => {
    setErrorMsg('');
    setSuccessMsg(''); // Hapus pesan jika melakukan scan baru
    
    if (!memberIdInput.trim()) {
      setErrorMsg("Please enter a member ID to scan.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await refreshMemberData();

      if (data.active.length === 0) {
        setSuccessMsg(`${data.user.nama} does not have any outstanding book borrowings.`);
      }
    } catch (error) {
      setErrorMsg(error.response?.data || "Member not found in the system.");
    } finally {
      setIsLoading(false);
    }
  };

  // Membuka Modal Konfirmasi
  const openConfirmModal = (itemBukuId, judulBuku) => {
    setErrorMsg('');
    setSuccessMsg('');
    setConfirmModal({ isOpen: true, itemBukuId, judulBuku });
  };

  // Menutup semua modal
  const closeModals = () => {
    setConfirmModal({ isOpen: false, itemBukuId: null, judulBuku: '' });
    setFeeModal({ isOpen: false, judulBuku: '', denda: 0 });
  };

  // Fungsi Eksekusi API Kembalikan Buku
  const processReturnBook = async () => {
    setIsReturning(true);
    try {
      const response = await api.post(`/transaksi/kembali/${confirmModal.itemBukuId}`);
      const resultData = response.data; 
      
      // Jika berhasil, tutup modal konfirmasi
      setConfirmModal({ isOpen: false, itemBukuId: null, judulBuku: '' });
      
      // Refresh tabel tanpa memanggil handleScanMember() agar pesan tidak terhapus
      await refreshMemberData();
      
      // Cek apakah ada denda
      if (resultData && resultData.denda > 0) {
        setFeeModal({ isOpen: true, judulBuku: confirmModal.judulBuku, denda: resultData.denda });
        setSuccessMsg(''); // Bersihkan sukses karena denda lebih penting
      } else {
        setErrorMsg('');
        setSuccessMsg(`The Transaction is Successful! "${confirmModal.judulBuku}" has been returned.`);
      }

    } catch (error) {
      closeModals();
      setErrorMsg(error.response?.data || "Failed to process book return.");
    } finally {
      setIsReturning(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex w-full min-h-screen bg-[#F7F8FA] font-sans text-gray-900">
      
      <AdminSidebar onLogout={onLogout} />

      <main className="flex-grow p-8 md:p-12 overflow-y-auto relative">
        
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Return Books</h1>
          <p className="text-sm text-gray-500 font-medium">Process book returns and check-ins</p>
        </header>

        {/* Notifikasi Dibuat Melebar (w-full) */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-semibold w-full">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold w-full">
            {successMsg}
          </div>
        )}

        {/* Batasan max-w-4xl Dihapus agar form & tabel melebar penuh */}
        <div className="w-full">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col mb-8">
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-900 mb-3">Scan Member ID</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={memberIdInput}
                  onChange={(e) => setMemberIdInput(e.target.value)}
                  placeholder="Enter member ID (e.g., 1)" 
                  className="flex-grow border border-[#93C5FD] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 placeholder-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleScanMember();
                  }}
                />
                <button 
                  onClick={handleScanMember}
                  disabled={isLoading}
                  className={`font-bold text-base px-8 py-3 rounded-lg transition-colors ${
                    isLoading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600 text-white'
                  }`}
                >
                  {isLoading ? 'Scanning...' : 'Scan'}
                </button>
              </div>
            </div>
          </div>

          {memberData && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
              <div className="px-8 py-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-black tracking-wide">{memberData.nama}</h2>
                  <p className="text-xs text-gray-500 font-medium">Email: {memberData.email}</p>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  {borrowedBooks.length} Active Borrows
                </div>
              </div>

              {borrowedBooks.length > 0 ? (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Barcode</th>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Borrow Date</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-medium">
                      {borrowedBooks.map((trx) => (
                        <tr key={trx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-500 font-bold">{trx.kodeBarcode}</td>
                          <td className="px-6 py-4 text-black font-bold max-w-[250px] truncate" title={trx.judulBuku}>
                            {trx.judulBuku}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{formatDate(trx.tanggalPinjam)}</td>
                          <td className="px-6 py-4 text-gray-500">{formatDate(trx.batasKembali)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                              trx.statusTransaksi === 'Terlambat' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {translateStatus(trx.statusTransaksi)}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center">
                            <button 
                              onClick={() => openConfirmModal(trx.itemBukuId, trx.judulBuku)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold text-xs shadow-sm transition-colors"
                            >
                              Return Book
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white">
                  <svg className="w-12 h-12 text-green-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 font-semibold">All books have been returned successfully.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ========================================= */}
      {/* MODAL 1: KONFIRMASI PENGEMBALIAN BUKU */}
      {/* ========================================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeModals}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm mx-4 transform transition-transform animate-fade-in-up">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Confirm Return</h3>
            <p className="text-sm text-center text-gray-500 mb-6">
              Are you sure you want to return <br/>
              <span className="font-bold text-black">"{confirmModal.judulBuku}"</span>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={closeModals}
                disabled={isReturning}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={processReturnBook}
                disabled={isReturning}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-colors ${isReturning ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isReturning ? 'Processing...' : 'Yes, Return it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 2: PERINGATAN DENDA (LATE FEE) */}
      {/* ========================================= */}
      {feeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm mx-4 transform transition-transform animate-fade-in-up border-t-4 border-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-red-600 mb-1">Book Returned!</h3>
            <h4 className="text-sm font-bold text-center text-gray-800 mb-4">But there is an Outstanding Fine.</h4>
            
            <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
              <p className="text-xs text-center text-red-700 font-medium mb-1">Total Late Fee for "{feeModal.judulBuku}"</p>
              <p className="text-2xl font-black text-center text-red-600">Rp {feeModal.denda.toLocaleString('id-ID')}</p>
            </div>

            <button 
              onClick={closeModals}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-red-500/30"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReturnBooksPage;
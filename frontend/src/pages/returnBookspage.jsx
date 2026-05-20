import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ReturnBooksPage = ({ onLogout }) => {
  const navigate = useNavigate();

  // State untuk Input Pencarian
  const [memberIdInput, setMemberIdInput] = useState('');
  
  // State untuk Data Member dan Transaksinya
  const [memberData, setMemberData] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  
  // State untuk Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fungsi untuk mencari member beserta buku yang dia pinjam
  const handleScanMember = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!memberIdInput.trim()) {
      setErrorMsg("Masukkan ID Member terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    try {
      // Ambil data profil member
      const userRes = await api.get(`/user/${memberIdInput}`);
      setMemberData(userRes.data);

      // Ambil daftar transaksi dari member ini
      const trxRes = await api.get(`/transaksi/user/${memberIdInput}`);
      
      // Filter hanya transaksi yang statusnya 'Berjalan' atau 'Terlambat'
      const activeBorrowings = trxRes.data.filter(
        trx => trx.statusTransaksi === 'Berjalan' || trx.statusTransaksi === 'Terlambat'
      );
      
      setBorrowedBooks(activeBorrowings);

      if (activeBorrowings.length === 0) {
        setSuccessMsg(`${userRes.data.nama} tidak memiliki tanggungan buku yang belum dikembalikan.`);
      }

    } catch (error) {
      setMemberData(null);
      setBorrowedBooks([]);
      setErrorMsg(error.response?.data || "Member tidak ditemukan di sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fungsi untuk mengembalikan satu buku
  const handleReturnBook = async (itemBukuId, judulBuku) => {
    if (!window.confirm(`Proses pengembalian buku "${judulBuku}"?`)) return;

    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      // Panggil API pengembalian buku ASP.NET
      const response = await api.post(`/transaksi/kembali/${itemBukuId}`);
      
      // Response biasanya berisi info denda (jika ada) dari backend
      const resultData = response.data; 
      
      if (resultData && resultData.denda > 0) {
        alert(`Buku berhasil dikembalikan. Perhatian: Terdapat Denda Keterlambatan sebesar Rp ${resultData.denda.toLocaleString('id-ID')}`);
      } else {
        setSuccessMsg(`Buku "${judulBuku}" berhasil dikembalikan!`);
      }

      // Refresh tabel otomatis dengan memanggil fungsi scan lagi
      handleScanMember(); 

    } catch (error) {
      setErrorMsg(error.response?.data || "Gagal memproses pengembalian buku.");
    }
  };

  // Format tanggal ke bentuk DD-MM-YYYY
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex w-full min-h-screen bg-[#F7F8FA] font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h2 className="font-bold text-sm tracking-wide text-black">Library Admin</h2>
        </div>
        
        <nav className="flex flex-col py-4">
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          <button onClick={() => navigate('/admin/borrow')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Borrow Books
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          {/* Active Link */}
          <button onClick={() => navigate('/admin/return')} className="flex items-center gap-3 px-6 py-3 border-l-4 border-black bg-gray-50 text-black font-bold text-sm text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            Return Books
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          <button onClick={() => navigate('/admin/members')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Members
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          <button onClick={() => navigate('/admin/catalog')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Catalogs
          </button>
        </nav>
        
        {/* Logout at bottom */}
        <div className="mt-auto p-4">
            <button onClick={() => {
              if(onLogout) onLogout();
              navigate('/admin');
            }} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 font-semibold py-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Return Books</h1>
          <p className="text-sm text-gray-500 font-medium">Process book returns and check-ins</p>
        </header>

        {/* Notifikasi Global */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-semibold w-full max-w-4xl">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold w-full max-w-4xl">
            {successMsg}
          </div>
        )}

        <div className="w-full max-w-4xl">
          
          {/* Scan Card */}
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

          {/* Area Hasil Transaksi Member */}
          {memberData && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Barcode Fisik</th>
                        <th className="px-6 py-4">Judul Buku</th>
                        <th className="px-6 py-4">Tgl Pinjam</th>
                        <th className="px-6 py-4">Batas Kembali</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-medium">
                      {borrowedBooks.map((trx) => (
                        <tr key={trx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-500 font-bold">{trx.kodeBarcode}</td>
                          <td className="px-6 py-4 text-black font-bold max-w-[200px] truncate" title={trx.judulBuku}>
                            {trx.judulBuku}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{formatDate(trx.tanggalPinjam)}</td>
                          <td className="px-6 py-4 text-gray-500">{formatDate(trx.batasKembali)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold ${
                              trx.statusTransaksi === 'Terlambat' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {trx.statusTransaksi}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center">
                            <button 
                              onClick={() => handleReturnBook(trx.itemBukuId, trx.judulBuku)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold text-xs shadow-sm transition-colors"
                            >
                              Kembalikan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <svg className="w-12 h-12 text-green-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 font-semibold">Semua buku sudah dikembalikan dengan baik.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
};

export default ReturnBooksPage;
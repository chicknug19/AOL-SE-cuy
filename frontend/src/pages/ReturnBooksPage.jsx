import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar'; // Import Sidebar komponen

const ReturnBooksPage = ({ onLogout }) => {
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

        // Decode token untuk mendapatkan ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.nameid;

        // Cek Role user tersebut ke backend
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
      
      {/* Panggil Sidebar Baru */}
      <AdminSidebar onLogout={onLogout} />

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
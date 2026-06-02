import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';

const AdminHomePage = ({ onLogout }) => {
  const navigate = useNavigate(); 

  // State untuk menampung data dari database
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 0,
    borrowedBooks: 0,
    activeMembers: 0,
    recentTransactions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE UNTUK TABLE CONTROLS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'tanggalPinjam', direction: 'desc' }); // Default urutkan dari yang terbaru
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 untuk dashboard

  useEffect(() => {
    const fetchDashboard = async () => {
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
          return;
        }

        const response = await api.get('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
        localStorage.removeItem('token');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // Format tanggal agar lebih rapi
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // --- LOGIKA FILTER, SORTING & PAGINATION ---
  
  // 1. Filter Search & Status
  let processedTransactions = dashboardData.recentTransactions.filter(trx => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (trx.namaUser && trx.namaUser.toLowerCase().includes(searchLower)) ||
      (trx.judulBuku && trx.judulBuku.toLowerCase().includes(searchLower)) ||
      (trx.userId && trx.userId.toString().includes(searchLower));
    
    const matchesStatus = statusFilter === 'All' || trx.statusTransaksi === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 2. Sorting
  processedTransactions.sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Penanganan khusus jika yang di-sort adalah tanggal
    if (sortConfig.key === 'tanggalPinjam' || sortConfig.key === 'batasKembali') {
      aValue = new Date(aValue || 0).getTime();
      bValue = new Date(bValue || 0).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // 3. Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex w-full min-h-screen bg-[#F7F8FA] font-sans text-gray-900">
      
      <AdminSidebar onLogout={onLogout} />

      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">Welcome to the library management system</p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500 font-bold">Memuat data statistik...</p>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Total Titles</p>
                  <h3 className="text-3xl font-bold text-black">{dashboardData.totalBooks}</h3>
                </div>
                <div className="w-14 h-14 bg-[#819CFA] rounded-xl flex items-center justify-center text-white shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Currently Borrowed</p>
                  <h3 className="text-3xl font-bold text-black">{dashboardData.borrowedBooks}</h3>
                </div>
                <div className="w-14 h-14 bg-[#00FF3C] rounded-xl flex items-center justify-center text-white shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Active Members</p>
                  <h3 className="text-3xl font-bold text-black">{dashboardData.activeMembers}</h3>
                </div>
                <div className="w-14 h-14 bg-[#B554FF] rounded-xl flex items-center justify-center text-white shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
              </div>
            </div>

            {/* Filter Bar untuk Transaksi */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow flex items-center bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2.5">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by User Name or Book Title" 
                  className="flex-grow bg-transparent text-sm outline-none placeholder-gray-400 text-gray-700 font-medium"
                />
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2.5 flex items-center min-w-[200px] relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none appearance-none cursor-pointer pr-6"
                >
                  <option value="All">All Statuses</option>
                  <option value="Berjalan">Berjalan (Active)</option>
                  <option value="Terlambat">Terlambat (Overdue)</option>
                  <option value="Selesai">Selesai (Returned)</option>
                </select>
                <svg className="w-4 h-4 text-gray-500 absolute right-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-black tracking-wide">Transactions ({processedTransactions.length})</h2>
                
                {/* Opsi Items Per Page */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  Show
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="border border-gray-200 rounded px-2 py-1 outline-none text-black cursor-pointer bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  entries
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">
                      <th className="px-8 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('namaUser')}>
                        User {sortConfig.key === 'namaUser' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('judulBuku')}>
                        Book Title {sortConfig.key === 'judulBuku' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('tanggalPinjam')}>
                        Borrow Date {sortConfig.key === 'tanggalPinjam' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('batasKembali')}>
                        Due Date {sortConfig.key === 'batasKembali' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-8 py-4 text-center cursor-pointer hover:bg-gray-100" onClick={() => requestSort('statusTransaksi')}>
                        Status {sortConfig.key === 'statusTransaksi' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-8 text-center text-gray-500 font-medium bg-white">
                          Tidak ada transaksi yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((trx) => (
                        <tr key={trx.id} className="border-b border-gray-50 bg-white hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-4 font-bold text-black">{trx.namaUser || `ID: ${trx.userId}`}</td>
                          <td className="px-6 py-4 text-gray-700 font-medium max-w-[200px] truncate" title={trx.judulBuku}>{trx.judulBuku || `Item ID: ${trx.itemBukuId}`}</td>
                          <td className="px-6 py-4 text-gray-500">{formatDate(trx.tanggalPinjam)}</td>
                          <td className="px-6 py-4 text-gray-500">{formatDate(trx.batasKembali)}</td>
                          <td className="px-8 py-4 flex justify-center">
                            <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-[11px] font-bold ${
                              trx.statusTransaksi === 'Berjalan' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              trx.statusTransaksi === 'Terlambat' ? 'bg-red-100 text-red-700 border border-red-200' :
                              'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                              {trx.statusTransaksi}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-8 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                  <p className="text-xs text-gray-500 font-medium">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, processedTransactions.length)} of {processedTransactions.length} entries
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-black hover:bg-gray-100 shadow-sm'}`}
                    >
                      Prev
                    </button>
                    <div className="flex items-center px-3 font-bold text-xs text-gray-700">
                      {currentPage} / {totalPages}
                    </div>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-black hover:bg-gray-100 shadow-sm'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default AdminHomePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';

const AdminMembersPage = ({ onLogout }) => {
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
        if (userRes.data.role !== "Admin") navigate('/');
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/admin');
      }
    };
    checkAccess();
  }, [navigate]);

  // State Data
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // State Sorting
  const [sortConfig, setSortConfig] = useState({ key: 'nama', direction: 'asc' });

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // =================================================================
  // STATE UNTUK MODAL POPUP BLACKLIST
  // =================================================================
  const [blacklistModal, setBlacklistModal] = useState({ 
    isOpen: false, 
    userId: null, 
    memberName: '', 
    isCurrentlyBlacklisted: false 
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get('/user/members-stats');
        setMembers(response.data);
      } catch (error) {
        console.error("Gagal memuat data member:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // =================================================================
  // FUNGSI KONTROL MODAL BLACKLIST
  // =================================================================
  const openBlacklistModal = (userId, isCurrentlyBlacklisted, memberName) => {
    setBlacklistModal({ isOpen: true, userId, memberName, isCurrentlyBlacklisted });
  };

  const closeBlacklistModal = () => {
    if (!isProcessing) {
      setBlacklistModal({ isOpen: false, userId: null, memberName: '', isCurrentlyBlacklisted: false });
    }
  };

  const confirmToggleBlacklist = async () => {
    setIsProcessing(true);
    try {
      const response = await api.put(`/user/toggle-blacklist/${blacklistModal.userId}`);
      
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === blacklistModal.userId 
            ? { ...member, isBlacklisted: response.data.isBlacklisted } 
            : member
        )
      );
      
      closeBlacklistModal();
    } catch (error) {
  // Ubah jadi ini untuk melihat error sebenarnya di Console Browser (F12)
  console.error("Detail Error:", error.response ? error.response.data : error.message);
  alert(`Error: ${error.response ? error.response.data : error.message}`);
} finally {
      setIsProcessing(false);
    }
  };
  // =================================================================

  // 1. Logika Search & Status Filter
  let processedMembers = members.filter(member => {
    const matchesSearch = 
      member.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.id.toString().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Blacklisted') matchesStatus = member.isBlacklisted;
    else if (statusFilter === 'Has Fines') matchesStatus = !member.isBlacklisted && member.totalFines > 0;
    else if (statusFilter === 'Borrowing') matchesStatus = !member.isBlacklisted && member.totalFines === 0 && member.activeBorrowedBooks > 0;
    else if (statusFilter === 'Active') matchesStatus = !member.isBlacklisted && member.totalFines === 0 && member.activeBorrowedBooks === 0;

    return matchesSearch && matchesStatus;
  });

  // 2. Logika Sorting
  processedMembers.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // 3. Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedMembers.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="flex w-full min-h-screen bg-[#F7F8FA] font-sans text-gray-900">
      <AdminSidebar onLogout={onLogout} />

      <main className="flex-grow p-8 md:p-12 overflow-y-auto relative">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Bookugers Member Management</h1>
          <p className="text-sm text-gray-500 font-medium">Manage And Monitor Library Members</p>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow flex items-center bg-white rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] px-4 py-3">
            <svg className="w-5 h-5 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Member ID, Name, or Email" 
              className="flex-grow bg-transparent text-sm outline-none placeholder-gray-400 text-gray-700 font-medium"
            />
          </div>
          
          <div className="bg-white rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] px-4 py-3 flex items-center min-w-[200px] relative">
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-transparent text-sm font-medium text-black outline-none appearance-none cursor-pointer pl-2 pr-6"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active / Clear</option>
              <option value="Borrowing">Borrowing</option>
              <option value="Has Fines">Has Fines</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
            <svg className="w-4 h-4 text-black absolute right-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Members Table Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden w-full">
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-black tracking-wide">
              Members ({processedMembers.length})
            </h2>
            
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              Show
              <select 
                value={itemsPerPage} 
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-200 rounded px-2 py-1 outline-none text-black cursor-pointer"
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
                <tr className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">
                  <th className="px-8 py-4 cursor-pointer hover:bg-gray-50" onClick={() => requestSort('id')}>
                    Member ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => requestSort('nama')}>
                    Full Name / Email {sortConfig.key === 'nama' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-center cursor-pointer hover:bg-gray-50" onClick={() => requestSort('activeBorrowedBooks')}>
                    Borrowed Books {sortConfig.key === 'activeBorrowedBooks' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => requestSort('totalFines')}>
                    Total Fines {sortConfig.key === 'totalFines' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th> 
                </tr>
              </thead>
              <tbody className="text-sm">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-8 py-8 text-center text-gray-500 font-bold">Loading data...</td></tr>
                ) : currentItems.length === 0 ? (
                  <tr><td colSpan="6" className="px-8 py-8 text-center text-gray-500 font-bold">No members found.</td></tr>
                ) : (
                  currentItems.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 font-bold text-black">{member.id}</td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-800">{member.nama}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </td>
                      <td className="px-6 py-5 text-gray-500 text-center font-bold">{member.activeBorrowedBooks}</td>
                      <td className={`px-6 py-5 font-bold ${member.totalFines > 0 ? 'text-[#F87171]' : 'text-gray-500'}`}>
                        {formatRupiah(member.totalFines)}
                      </td>
                      <td className="px-8 py-5 flex justify-center">
                        {member.isBlacklisted ? (
                          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#FCA5A5] text-[#991B1B] w-28 border border-[#991B1B]/20">Blacklisted</span>
                        ) : member.totalFines > 0 ? (
                          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 w-28 border border-yellow-300">Has Fines</span>
                        ) : member.activeBorrowedBooks > 0 ? (
                          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#93C5FD] text-[#1E3A8A] w-28 border border-[#1E3A8A]/20">Borrowing</span>
                        ) : (
                          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#86EFAC] text-[#14532D] w-28 border border-[#14532D]/20">Active / Clear</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => openBlacklistModal(member.id, member.isBlacklisted, member.nama)}
                          className={`px-3 py-1.5 rounded text-xs font-bold text-white transition-colors shadow-sm ${
                            member.isBlacklisted 
                              ? 'bg-gray-500 hover:bg-gray-600'
                              : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          {member.isBlacklisted ? 'Remove Blacklist' : 'Set Blacklist'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="px-8 py-5 border-t border-gray-200 flex justify-between items-center bg-gray-50">
              <p className="text-xs text-gray-500 font-semibold">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, processedMembers.length)} of {processedMembers.length} entries
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-xs font-bold rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-black hover:bg-gray-100'}`}
                >
                  Prev
                </button>
                <div className="flex items-center px-3 font-bold text-sm">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-xs font-bold rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-black hover:bg-gray-100'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================= */}
      {/* MODAL: KONFIRMASI BLACKLIST               */}
      {/* ========================================= */}
      {blacklistModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeBlacklistModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm mx-4 transform transition-transform animate-fade-in-up">
            
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${blacklistModal.isCurrentlyBlacklisted ? 'bg-gray-100' : 'bg-red-100'}`}>
              <svg className={`w-7 h-7 ${blacklistModal.isCurrentlyBlacklisted ? 'text-gray-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Confirm Action</h3>
            <p className="text-sm text-center text-gray-500 mb-6">
              Are you sure you want to {blacklistModal.isCurrentlyBlacklisted ? 'remove the blacklist status from' : 'BLACKLIST'} the member:<br/>
              <span className="font-bold text-black">{blacklistModal.memberName}</span>?
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={closeBlacklistModal}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmToggleBlacklist}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-colors ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : blacklistModal.isCurrentlyBlacklisted 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMembersPage;
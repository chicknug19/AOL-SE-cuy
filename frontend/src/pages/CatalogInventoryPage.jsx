import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';

const CatalogInventoryPage = ({ onLogout }) => {
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
  
  // State Utama Data
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- STATE UNTUK TABLE CONTROLS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'judul', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // State untuk Modal Form (Add/Edit)
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add' });
  const [formData, setFormData] = useState({
    id: null, isbn: '', judul: '', pengarang: '', penerbit: '', 
    tahunTerbit: '', kategori: 'Umum', deskripsi: '', coverUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil Data Semua Buku dari Backend
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/buku');
      setBooks(response.data);
    } catch (error) {
      console.error("Gagal memuat katalog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // --- LOGIKA FILTER, SORTING & PAGINATION ---
  
  // 1. Filter Search & Category
  let processedBooks = books.filter(book => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (book.judul && book.judul.toLowerCase().includes(searchLower)) || 
      (book.isbn && book.isbn.toLowerCase().includes(searchLower)) ||
      (book.pengarang && book.pengarang.toLowerCase().includes(searchLower));
    
    const matchesCategory = categoryFilter === 'All' || book.kategori === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // 2. Sorting
  processedBooks.sort((a, b) => {
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";

    if (typeof aValue === 'string') {
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
  const currentItems = processedBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedBooks.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // --- LOGIKA MODAL & CRUD ---
  const openModal = (mode, bookData = null) => {
    if (mode === 'edit' && bookData) {
      setFormData({
        id: bookData.id,
        isbn: bookData.isbn || '',
        judul: bookData.judul || '',
        pengarang: bookData.pengarang || '',
        penerbit: bookData.penerbit || '',
        tahunTerbit: bookData.tahunTerbit || '',
        kategori: bookData.kategori || 'Umum',
        deskripsi: bookData.deskripsi || '',
        coverUrl: bookData.coverUrl || ''
      });
    } else {
      setFormData({
        id: null, isbn: '', judul: '', pengarang: '', penerbit: '', 
        tahunTerbit: '', kategori: 'Umum', deskripsi: '', coverUrl: ''
      });
    }
    setModalState({ isOpen: true, mode });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'add' });
  };

  const handleSaveBook = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        judul: formData.judul,
        pengarang: formData.pengarang,
        isbn: formData.isbn,
        kategori: formData.kategori,
        tahunTerbit: formData.tahunTerbit ? formData.tahunTerbit.toString() : "",
        deskripsi: formData.deskripsi,
        coverUrl: formData.coverUrl
      };

      if (modalState.mode === 'add') {
        await api.post('/buku', payload);
        alert('Buku berhasil ditambahkan!');
      } else {
        await api.put(`/buku/${formData.id}`, payload);
        alert('Buku berhasil diperbarui!');
      }

      closeModal();
      fetchBooks(); 
    } catch (error) {
      alert(error.response?.data || "Gagal menyimpan buku");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteBook = async (id, judul) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku "${judul}"?`)) {
      try {
        await api.delete(`/buku/${id}`);
        alert('Buku berhasil dihapus!');
        fetchBooks();
      } catch (error) {
        alert("Gagal menghapus buku. Pastikan tidak ada stok fisik atau transaksi terkait.");
      }
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#F7F8FA] font-sans text-gray-900">
      
      <AdminSidebar onLogout={onLogout} />

      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Bookugers Catalog Inventory</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and organize your library book collection</p>
        </header>

        {/* Filter and Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          
          <div className="flex-grow flex items-center bg-white rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] px-5 py-3 max-w-2xl">
            <svg className="w-5 h-5 text-black font-bold mr-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by ISBN, Title, or Author" 
              className="flex-grow bg-transparent text-sm outline-none placeholder-gray-400 text-gray-700 font-medium"
            />
          </div>
          
          <div className="flex gap-4 items-center flex-wrap">
            {/* Dropdown Kategori Filter Dinamis */}
            <div className="bg-white rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] px-6 py-3 flex items-center min-w-[180px] relative">
              <select 
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent text-sm font-semibold text-black outline-none appearance-none cursor-pointer pr-6"
              >
                <option value="All">All Categories</option>
                <option value="Umum">Umum</option>
                <option value="Fiction">Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="IT & Tech">IT & Tech</option>
              </select>
              <svg className="w-4 h-4 text-black absolute right-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <button 
              onClick={() => openModal('add')}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 flex items-center gap-2 text-sm font-semibold transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              Add New Book
            </button>
          </div>
        </div>

        {/* Inventory Table Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden w-full">
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-black tracking-wide">Book Inventory ({processedBooks.length})</h2>
            
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
                <option value={50}>50</option>
              </select>
              entries
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider select-none">
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('isbn')}>
                    ISBN {sortConfig.key === 'isbn' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('judul')}>
                    Book Title {sortConfig.key === 'judul' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('pengarang')}>
                    Author {sortConfig.key === 'pengarang' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('kategori')}>
                    Category {sortConfig.key === 'kategori' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => requestSort('tahunTerbit')}>
                    Pub. Year {sortConfig.key === 'tahunTerbit' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Memuat data katalog...</td></tr>
                ) : currentItems.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada buku yang ditemukan.</td></tr>
                ) : (
                  currentItems.map((book) => (
                    <tr key={book.id} className="border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 text-black">{book.isbn || "-"}</td>
                      <td className="px-6 py-5 text-gray-700 max-w-[200px] truncate" title={book.judul}>{book.judul}</td>
                      <td className="px-6 py-5 text-gray-500 max-w-[150px] truncate" title={book.pengarang}>{book.pengarang}</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-[#93C5FD] text-[#1E3A8A]">
                          {book.kategori || "Umum"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-500">{book.tahunTerbit}</td>
                      <td className="px-6 py-5 flex justify-center gap-4">
                        <button onClick={() => openModal('edit', book)} className="text-blue-500 hover:text-blue-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteBook(book.id, book.judul)} className="text-red-500 hover:text-red-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-8 py-5 border-t border-gray-200 flex justify-between items-center bg-gray-50">
              <p className="text-xs text-gray-500 font-semibold">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, processedBooks.length)} of {processedBooks.length} entries
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

      {/* Slide-over Overlay Modal untuk CRUD (Tetap Sama) */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity" onClick={closeModal}></div>
          <div className="relative w-full max-w-[400px] bg-white h-full shadow-2xl flex flex-col transform transition-transform overflow-y-auto z-10 border-l border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-start bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-bold text-black mb-1">{modalState.mode === 'add' ? 'Add New Book' : 'Edit Book'}</h2>
                <p className="text-[11px] text-gray-500 font-medium">{modalState.mode === 'add' ? 'Create New Catalog Item' : 'Update Catalog Info'}</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-black p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">ISBN</label>
                <input type="text" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} placeholder="978-X-XXXXX-XXX" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Book Title *</label>
                <input type="text" required value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} placeholder="Enter book title" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Author Name *</label>
                <input type="text" required value={formData.pengarang} onChange={(e) => setFormData({...formData, pengarang: e.target.value})} placeholder="Enter author name" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Publisher</label>
                <input type="text" value={formData.penerbit} onChange={(e) => setFormData({...formData, penerbit: e.target.value})} placeholder="Enter publisher name" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Publication Year</label>
                <input type="number" value={formData.tahunTerbit} onChange={(e) => setFormData({...formData, tahunTerbit: e.target.value})} placeholder="YYYY" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Category</label>
                <div className="relative">
                  <select value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 appearance-none font-semibold">
                    <option value="Umum">Umum</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="IT & Tech">IT & Tech</option>
                  </select>
                  <svg className="w-3 h-3 text-black absolute right-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Cover Image URL</label>
                <input type="text" value={formData.coverUrl} onChange={(e) => setFormData({...formData, coverUrl: e.target.value})} placeholder="https://example.com/image.jpg" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Book Synopsis</label>
                <textarea rows="3" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} placeholder="Enter a brief description..." className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 resize-none"></textarea>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-200 flex gap-4 mt-auto sticky bottom-0 bg-white z-10">
              <button 
                onClick={handleSaveBook}
                disabled={isSubmitting || !formData.judul || !formData.pengarang}
                className={`flex-1 font-bold text-xs py-3 rounded-md transition-colors shadow-sm ${
                  isSubmitting || !formData.judul || !formData.pengarang ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600 text-white'
                }`}
              >
                {isSubmitting ? 'Saving...' : (modalState.mode === 'add' ? 'Save Book' : 'Save Changes')}
              </button>
              <button onClick={closeModal} className="flex-1 bg-white border border-black text-black hover:bg-gray-50 font-bold text-xs py-3 rounded-md transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogInventoryPage;
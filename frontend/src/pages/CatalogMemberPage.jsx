import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CatalogMemberPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Filter & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/buku');
        setBooks(response.data);
      } catch (error) {
        console.error("Gagal memuat katalog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Menghasilkan daftar kategori unik dari data buku yang ada di database
  const categories = ['All', ...new Set(books.map(b => b.kategori || 'Umum'))];

  // Logika Filter: Gabungan antara Kategori dan Pencarian Teks
  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || (book.kategori || 'Umum') === selectedCategory;
    const matchesSearch = 
      (book.judul && book.judul.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.pengarang && book.pengarang.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F2FBFA] font-sans text-gray-900 pb-12">
      
      {/* Header / Navigasi Atas */}
      <header className="bg-white py-4 px-6 md:px-12 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight text-gray-900">Explore Catalog</h1>
            <p className="text-[10px] text-gray-500 font-medium">Discover your next favorite book</p>
          </div>
        </div>

        {/* Search Bar di Header */}
        <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-all w-[300px]">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search titles or authors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none ml-2 text-sm text-gray-700"
          />
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
        
        {/* Search Bar untuk Mobile (Merespon jika layar kecil) */}
        <div className="md:hidden flex items-center bg-white rounded-full px-4 py-3 mb-6 shadow-sm border border-gray-100">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none ml-2 text-sm"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Kategori (Sebelah Kiri) */}
          <aside className="w-full lg:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-shrink-0 sticky top-24">
            <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">Categories</h3>
            <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {categories.map((category, index) => (
                <li key={index} className="flex-shrink-0">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      selectedCategory === category 
                        ? 'bg-[#3B82F6] text-white shadow-md' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Grid Katalog Buku (Sebelah Kanan) */}
          <div className="flex-grow w-full">
            <div className="mb-6 flex justify-between items-end">
              <h2 className="font-bold text-xl text-gray-900">
                {selectedCategory === 'All' ? 'All Books' : `${selectedCategory} Books`}
              </h2>
              <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                {filteredBooks.length} Results
              </span>
            </div>

            {isLoading ? (
              <div className="w-full h-64 flex justify-center items-center">
                <p className="text-gray-500 font-bold">Memuat katalog...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col justify-center items-center text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Buku Tidak Ditemukan</h3>
                <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredBooks.map((book) => (
                  <div 
                    key={book.id} 
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                  >
                    <div className="w-full pt-[140%] relative overflow-hidden bg-gray-100">
                      <img 
                        src={book.coverUrl || "https://placehold.co/400x600?text=No+Cover"} 
                        alt={book.judul} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-max mb-2">
                        {book.kategori || "Umum"}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1 line-clamp-2" title={book.judul}>
                        {book.judul}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-auto">{book.pengarang}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
};

export default CatalogMemberPage;
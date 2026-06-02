import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const SearchPage = () => {
  const navigate = useNavigate();
  
  // Menangkap parameter pencarian dari URL
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE UNTUK RECENT SEARCHES (Diambil dari LocalStorage) ---
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('bookugers_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  // Mengambil seluruh katalog buku dari Backend
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

  // --- FUNGSI UNTUK MENYIMPAN PENCARIAN TERAKHIR ---
  const handleSearchAction = (term) => {
    setSearchQuery(term);
    
    if (term.trim() !== '') {
      // Hapus duplikat, lalu tambahkan ke urutan paling depan
      const updatedSearches = [
        term.trim(),
        ...recentSearches.filter(t => t.toLowerCase() !== term.trim().toLowerCase())
      ].slice(0, 5); // Maksimal simpan 5 history

      setRecentSearches(updatedSearches);
      localStorage.setItem('bookugers_recent_searches', JSON.stringify(updatedSearches));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('bookugers_recent_searches');
  };

  // --- LOGIKA FILTER PENCARIAN ---
  const filteredBooks = books.filter(book => 
    (book.judul && book.judul.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (book.pengarang && book.pengarang.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (book.kategori && book.kategori.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- LOGIKA REKOMENDASI BUKU ---
  // Secara otomatis menyeleksi 4 buku terbaik/teratas dari kategori unggulan untuk direkomendasikan
  const recommendedBooks = books
    .filter(b => ['Computer Science', 'Finance', 'Business'].includes(b.kategori))
    .slice(0, 4);
    
  // Jika buku kurang dari 4, lengkapi dengan buku lainnya
  if (recommendedBooks.length < 4 && books.length > 0) {
    const others = books.filter(b => !['Computer Science', 'Finance', 'Business'].includes(b.kategori));
    recommendedBooks.push(...others.slice(0, 4 - recommendedBooks.length));
  }

  return (
    <div className="w-full min-h-screen bg-[#F3FCFC] font-sans text-gray-800 relative pb-12">
      
      {/* Top Header Background */}
      <div className="w-full h-48 bg-[#E3FAFA] absolute top-0 left-0 z-0"></div>
      
      {/* Top Navigation / Back Link */}
      <div className="relative z-20 w-full px-6 md:px-12 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2 px-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-6 drop-shadow-sm cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-[#2E8B57]" viewBox="0 0 100 100" fill="currentColor">
               <circle cx="50" cy="50" r="45" fill="white" stroke="#2E8B57" strokeWidth="4"/>
               <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
               <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
               <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#2E8B57"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-wide text-gray-900">Bookugers</h1>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl bg-white rounded-2xl flex items-center px-6 py-4 shadow-sm border border-gray-100 mb-2 focus-within:border-blue-400 transition-colors">
          <svg 
            onClick={() => handleSearchAction(searchQuery)}
            className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer flex-shrink-0 transition-colors" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search for books, authors, or categories" 
            className="w-full bg-transparent outline-none border-none ml-4 text-gray-700 placeholder-gray-400 font-medium text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchAction(searchQuery);
            }}
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="mt-12 text-gray-500 font-bold">Memuat katalog buku...</div>
        ) : (
          /* Dynamic Content: Empty Search View OR Search Results */
          searchQuery.trim() === '' ? (
            
            /* --- EMPTY SEARCH STATE (History & Recommendations) --- */
            <div className="w-full max-w-4xl mt-6 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Recent Searches Widget */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-sm">Recent Searches</h3>
                    {recentSearches.length > 0 && (
                      <button onClick={clearRecentSearches} className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  {recentSearches.length > 0 ? (
                    <ul className="space-y-1">
                      {recentSearches.map((term, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-center gap-3 text-sm text-gray-600 font-medium cursor-pointer hover:bg-gray-50 hover:text-blue-600 px-2 py-2 rounded-lg transition-colors" 
                          onClick={() => handleSearchAction(term)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {term}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs text-gray-400 font-medium">No recent searches.</p>
                    </div>
                  )}
                </div>

                {/* 2. Popular Categories Widget */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 text-sm mb-4">Explore by Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Computer Science', 'Finance', 'Fiction', 'Fantasy', 'Business'].map((cat, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 bg-[#F0F2F5] text-gray-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        onClick={() => handleSearchAction(cat)}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Recommended Books Widget */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 text-sm mb-5">Recommended For You</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedBooks.map(book => (
                    <div 
                      key={book.id}
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="flex flex-col cursor-pointer group"
                    >
                      <div className="w-full pt-[140%] relative overflow-hidden bg-gray-100 rounded-lg shadow-sm border border-gray-100 mb-2">
                        <img 
                          src={book.coverUrl || "https://placehold.co/400x600?text=No+Cover"} 
                          alt={book.judul} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }}
                        />
                      </div>
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{book.judul}</h4>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{book.pengarang}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            
            /* --- SEARCH RESULTS GRID --- */
            <div className="w-full max-w-4xl mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Search Results for "{searchQuery}"</h2>
                <span className="text-sm font-semibold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">{filteredBooks.length} items</span>
              </div>
              
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBooks.map((book) => (
                    <div 
                      key={book.id} 
                      onClick={() => navigate(`/book/${book.id}`)} 
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={book.coverUrl || "https://placehold.co/400x600?text=No+Cover"} 
                        alt={book.judul} 
                        className="w-20 h-28 object-cover rounded shadow-sm flex-shrink-0" 
                        onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }}
                      />
                      <div className="flex flex-col justify-center py-1">
                        <h4 className="font-bold text-base text-gray-900 leading-tight mb-1 line-clamp-2">{book.judul}</h4>
                        <p className="text-sm text-gray-500 mb-2">{book.pengarang}</p>
                        <span className="inline-block bg-[#E6F4F1] text-[#2E8B57] text-xs font-bold px-2.5 py-1 rounded-md self-start">
                          {book.kategori || "Umum"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-12 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-bold text-gray-700 text-lg">No matches found</p>
                  <p className="text-sm mt-1">We couldn't find any books matching "{searchQuery}". Try different keywords.</p>
                </div>
              )}
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default SearchPage;
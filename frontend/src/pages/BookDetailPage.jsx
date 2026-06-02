import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import MemberHeader from '../components/MemberHeader'; // <-- Import Header
import bookCrypto from '../assets/book_crypto.png';

const BookDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // State untuk Data Buku Spesifik
  const [book, setBook] = useState(null);
  const [stockInfo, setStockInfo] = useState({ available: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Header
  const [userData, setUserData] = useState(null);
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Ambil detail buku berdasarkan ID
        const bookResponse = await api.get(`/buku/${id}`);
        setBook(bookResponse.data);

        // 2. Ambil informasi stok fisik buku
        try {
          const stockResponse = await api.get(`/itembuku/buku/${id}`);
          const items = stockResponse.data;
          setStockInfo({
            total: items.length,
            available: items.filter(item => item.status === 'Tersedia').length
          });
        } catch (stockError) {
          console.warn("Gagal mengambil data stok, mungkin endpoint belum siap.");
        }

        // 3. Ambil data User untuk Header (opsional, tidak memblokir jika gagal)
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.nameid;
          const userRes = await api.get(`/user/${userId}`);
          setUserData(userRes.data);
        }

        // 4. Ambil semua buku untuk Live Search di Header
        const allBooksRes = await api.get('/buku');
        setAllBooks(allBooksRes.data);

      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); // Effect akan dijalankan ulang jika ID di URL berubah

  if (isLoading) {
    return <div className="w-full min-h-screen flex justify-center items-center font-bold text-gray-500">Memuat data buku...</div>;
  }

  if (!book) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Buku tidak ditemukan!</h2>
        <button onClick={() => navigate('/search')} className="bg-black text-white px-6 py-2 rounded">Kembali ke Pencarian</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F2FBFA] font-sans text-gray-900 pb-12">
      
      {/* Panggil Header Baru Di Sini */}
      <MemberHeader userData={userData} allBooks={allBooks} />

      {/* Top Navigation / Back Link (TETAP DIPERTAHANKAN) */}
      <div className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-bold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Previous Page
          </button>
        </div>
      </div>

      {/* Main Content (Dibungkus kotak putih agar lebih rapi) */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Book Cover */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <img 
              src={book.coverUrl || bookCrypto} 
              alt={book.judul} 
              className="w-full max-w-[350px] h-auto rounded-2xl shadow-xl object-cover"
              onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }}
            />
          </div>

          {/* Right Column: Book Details */}
          <div className="lg:col-span-7 flex flex-col">
            
            <div className="mb-2">
              <span className="inline-block bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1 rounded-full mb-3">
                {book.kategori || "Umum"}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{book.judul}</h1>
            </div>
            
            <p className="text-base text-gray-600 font-medium mb-6">
              By <span className="text-gray-900 font-bold">{book.pengarang}</span> • {book.tahunTerbit}
            </p>
            
            <div className="w-full h-px bg-gray-100 mb-6"></div>

            <h3 className="text-lg font-bold mb-3 text-gray-900">Book Synopsis</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
              {book.deskripsi || "Sinopsis buku ini belum ditambahkan oleh Admin."}
            </p>

            {/* Location & Availability Card */}
            <div className="border border-gray-200 rounded-2xl p-6 md:p-8 max-w-lg bg-gray-50/50">
              <h4 className="font-bold text-sm mb-4 text-gray-900">Location & Availability</h4>
              
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${stockInfo.available > 0 ? 'border-green-500' : 'border-red-500'}`}>
                  {stockInfo.available > 0 ? (
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${stockInfo.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stockInfo.available > 0 ? 'Tersedia' : 'Kosong'}
                </span>
                <span className="text-xs text-gray-500 font-medium">({stockInfo.available} dari {stockInfo.total} copy)</span>
              </div>

              <div className="w-full h-px bg-gray-200 mb-6"></div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-1">Location:</p>
                  <p className="text-xs text-gray-500">{book.kategori || "Umum"}, Rak Utama</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 mt-4">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-1">ISBN:</p>
                  <p className="text-xs text-gray-500">{book.isbn || "Tidak tersedia"}</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetailPage;
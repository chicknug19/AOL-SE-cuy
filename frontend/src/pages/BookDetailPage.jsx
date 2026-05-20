import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
// Fallback gambar jika backend tidak mengirim URL gambar (opsional)
import bookCrypto from '../assets/book_crypto.png';

const BookDetailPage = () => {
  const { id } = useParams(); // Menangkap ID dari URL (misal: /book/1)
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [stockInfo, setStockInfo] = useState({ available: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // 1. Ambil detail buku berdasarkan ID
        const bookResponse = await api.get(`/buku/${id}`);
        setBook(bookResponse.data);

        // 2. Ambil informasi stok fisik buku (opsional, jika endpoint ini ada)
        // Jika endpoint /api/itembuku/buku/{bukuId} sudah pernah kita buat, kita tembak di sini
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

      } catch (error) {
        console.error("Gagal memuat detail buku:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
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
    <div className="w-full min-h-screen bg-white font-sans text-gray-900 pb-12">
      
      {/* Top Navigation / Back Link */}
      <div className="w-full border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4">
          <button 
            onClick={() => navigate(-1)} // navigate(-1) berfungsi persis seperti tombol 'Back' di browser
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Catalog
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Book Cover */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <img 
            // Gunakan gambar dari database jika ada (book.coverUrl), jika tidak pakai gambar default
            src={book.coverUrl || bookCrypto} 
            alt={book.judul} 
            className="w-full max-w-[400px] h-auto rounded-2xl shadow-xl object-cover"
          />
        </div>

        {/* Right Column: Book Details */}
        <div className="lg:col-span-7 flex flex-col">
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{book.judul}</h1>
          
          <p className="text-base text-gray-800 mb-2">
            <span className="font-bold">Author: </span>{book.pengarang}
          </p>
          <p className="text-base text-gray-800 mb-2">
            <span className="font-bold">Publication Year: </span>{book.tahunTerbit}
          </p>
          <p className="text-base text-gray-800 mb-8">
            <span className="font-bold">ISBN: </span>{book.isbn || "Tidak tersedia"}
          </p>

          <h3 className="text-lg font-bold mb-3">Book Synopsis</h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-10 max-w-2xl">
            {book.deskripsi || "Sinopsis buku ini belum ditambahkan oleh Admin."}
          </p>

          {/* Location & Availability Card */}
          <div className="border border-gray-300 rounded-xl p-6 md:p-8 max-w-lg">
            <h4 className="font-bold text-sm mb-4">Location & Availability</h4>
            
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
              <span className="text-xs text-gray-400 font-medium">({stockInfo.available} dari {stockInfo.total} copy)</span>
            </div>

            <div className="w-full h-px bg-gray-200 mb-6"></div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-xs font-bold text-gray-800 mb-1">Location:</p>
                <p className="text-xs text-gray-500">{book.kategori || "Umum"}, Rak Utama</p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default BookDetailPage;
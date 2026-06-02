import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const HomePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  
  // State untuk data dinamis
  const [userData, setUserData] = useState(null);
  const [activeBooks, setActiveBooks] = useState([]);
  const [stats, setStats] = useState({ totalFines: 0, dueSoon: 0, totalRead: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [allBooks, setAllBooks] = useState([]);

  // --- STATE UNTUK CAROUSEL SLIDER ---
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.nameid;

        const [userRes, trxRes, booksRes] = await Promise.all([
          api.get(`/user/${userId}`),
          api.get(`/transaksi/user/${userId}`),
          api.get('/buku')
        ]);

        if (userRes.data.role === "Admin") {
          navigate('/admin/dashboard');
          return; 
        }

        setUserData(userRes.data);
        setAllBooks(booksRes.data); 
        const allTransactions = trxRes.data;

        const today = new Date();
        let currentFines = 0;
        let dueSoonCount = 0;
        const currentlyBorrowed = [];
        const completedReads = [];

        allTransactions.forEach(trx => {
          if (trx.statusTransaksi === 'Berjalan' || trx.statusTransaksi === 'Terlambat') {
            currentlyBorrowed.push(trx);
            currentFines += (trx.denda || 0);

            const dueDate = new Date(trx.batasKembali);
            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 3) {
              dueSoonCount++;
            }
          } else if (trx.statusTransaksi === 'Selesai') {
            completedReads.push(trx);
          }
        });

        setActiveBooks(currentlyBorrowed);
        setStats({
          totalFines: currentFines,
          dueSoon: dueSoonCount,
          totalRead: completedReads.length
        });

      } catch (error) {
        console.error("Gagal memuat dashboard user:", error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDashboard();
  }, [navigate]);

  // Logika Rekomendasi Pencarian
  const recommendations = query.trim() === '' ? [] : allBooks
    .filter(b => b.judul.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.judul.localeCompare(b.judul))
    .slice(0, 5); 

  // --- LOGIKA PROGRESS BAR CERDAS ---
  // Sekarang membutuhkan Tanggal Pinjam & Batas Kembali untuk kalkulasi presisi
  const calculateDaysRemaining = (dueDateString, borrowDateString) => {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    const borrowDate = new Date(borrowDateString);
    
    // Hitung total durasi peminjaman (biasanya 7 hari dari backend)
    const totalDuration = Math.max(1, Math.ceil((dueDate - borrowDate) / (1000 * 60 * 60 * 24)));
    
    // Hitung sisa hari
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    // Hitung persentase waktu yang SUDAH BERLALU (Mulai dari 0% ke 100%)
    const passedDays = totalDuration - diffDays;
    let percentage = (passedDays / totalDuration) * 100;
    
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    // Logika Warna Responsif:
    let colorClass = 'bg-green-500'; // Default hijau (masih awal-awal)
    
    if (diffDays <= 2 && diffDays >= 0) {
      colorClass = 'bg-red-500'; // Sisa 2 hari = Merah
    } else if (diffDays <= (totalDuration / 2)) {
      colorClass = 'bg-yellow-400'; // Sisa setengah waktu (misal sisa 3 atau 4 hari) = Kuning
    }

    if (diffDays < 0) {
      colorClass = 'bg-red-700'; // Sudah terlambat (Overdue)
      percentage = 100; // Bar penuh merah gelap
    }

    return { days: diffDays, percentage, colorClass };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // --- FUNGSI NAVIGASI CAROUSEL ---
  // Slider SEKARANG SELALU menampilkan 5 buku pertama dari katalog sebagai "Featured"
  const carouselItems = allBooks.slice(0, 5);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };


  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center bg-[#F2FBFA] font-bold text-gray-500">Memuat Dashboard...</div>;
  }

  // Tentukan item yang sedang aktif di layar
  const currentCarouselBook = carouselItems[currentSlide];

  return (
    <div className="w-full min-h-screen bg-[#F2FBFA] font-sans text-gray-800 pb-12">
      
      {/* Top Navigation Bar */}
      <header className="bg-white py-3 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-sm border border-gray-100">
            <svg className="w-full h-full text-[#38A169]" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="white" stroke="#38A169" strokeWidth="3"/>
              <path d="M50 20 L25 40 L25 80 L75 80 L75 40 Z" fill="none" stroke="#4299E1" strokeWidth="3"/>
              <path d="M50 20 L50 80" stroke="#4299E1" strokeWidth="3"/>
              <path d="M50 35 L40 45 L50 55 L60 45 Z" fill="#38A169"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-gray-900">Bookugers</h1>
            <p className="text-[10px] text-gray-500">University Library System</p>
          </div>
        </div>

        <div className="relative w-full max-w-md mb-4 md:mb-0">
          <div className="w-full bg-white rounded-full flex items-center px-4 py-2 shadow-sm border border-gray-200 focus-within:border-blue-400 transition-colors">
            <svg 
              onClick={() => navigate(`/search?q=${query}`)}
              className="w-4 h-4 text-gray-500 flex-shrink-0 cursor-pointer hover:text-blue-500 transition-colors" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search for books, authors, or topics" 
              className="w-full bg-transparent outline-none border-none ml-3 text-gray-700 placeholder-gray-400 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/search?q=${query}`);
              }}
            />
          </div>

          {recommendations.length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50">
              {recommendations.map(book => (
                <div 
                  key={book.id}
                  onClick={() => navigate(`/search?q=${book.judul}`)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-800 border-b border-gray-100 last:border-0 flex items-center gap-3 font-semibold transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="truncate">{book.judul}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-right flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-gray-500">Welcome Back,</span>
            <span className="font-bold text-gray-900 text-sm">{userData?.nama || "Member"}</span>
          </div>
          <button onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
        
        {stats.dueSoon > 0 && (
          <div className="bg-[#FFF4E5] border border-[#F6AD55] rounded-lg p-4 mb-8 flex items-start gap-4 shadow-sm">
            <div className="text-[#DD6B20] mt-0.5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#C05621] text-sm md:text-base">{stats.dueSoon} Books Due Soon</h3>
              <p className="text-[#DD6B20] text-xs md:text-sm">Please return or renew your books before the due date to avoid fines.</p>
            </div>
          </div>
        )}

        {/* --- CAROUSEL SLIDER AKTIF --- */}
        <div className="relative w-full h-[300px] md:h-[400px] bg-[#9DBE99] rounded-xl overflow-hidden mb-10 flex justify-center items-center shadow-md">
          {currentCarouselBook ? (
            <>
              <img 
                src={currentCarouselBook.coverUrl || "https://placehold.co/400x600/C1272D/ffffff?text=Bookugers"} 
                alt="Featured Book" 
                onClick={() => navigate(`/book/${currentCarouselBook.id}`)}
                className="h-[90%] md:h-[95%] object-contain shadow-2xl z-10 rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105" 
                onError={(e) => { e.target.src = "https://placehold.co/400x600/C1272D/ffffff?text=Bookugers"; }}
              />
              
              {/* Tampilkan panah navigasi hanya jika item lebih dari 1 */}
              {carouselItems.length > 1 && (
                <>
                  <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors z-20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors z-20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  
                  {/* Titik indikator di bawah slider */}
                  <div className="absolute bottom-4 flex gap-2 z-20">
                    {carouselItems.map((_, idx) => (
                      <div key={idx} className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentSlide ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-white font-bold text-xl">Welcome to Bookugers</span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8">
            <h2 className="font-bold text-lg mb-4">My Borrowed Books</h2>
            
            {activeBooks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 font-medium">
                You haven't borrowed any books yet. 
                <button onClick={() => navigate('/search')} className="text-blue-500 ml-1 hover:underline">Explore the catalog!</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                {activeBooks.map((trx) => {
                  // Kirim tanggal pinjam untuk hitung persentase presisi
                  const timeInfo = calculateDaysRemaining(trx.batasKembali, trx.tanggalPinjam);
                  
                  return (
                    <div 
                      key={trx.id} 
                      onClick={() => navigate(`/book/${trx.bukuId || trx.itemBukuId}`)} 
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 h-full cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={trx.coverUrl || "https://placehold.co/400x600?text=No+Cover"} 
                        alt="Book" 
                        className="w-20 h-28 object-cover rounded shadow-sm flex-shrink-0" 
                        onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }}
                      />
                      <div className="flex flex-col justify-between py-1 w-full">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 leading-tight">{trx.judulBuku}</h4>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">{trx.kodeBarcode}</p>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            Due: {formatDate(trx.batasKembali)}
                          </div>
                          
                          {timeInfo.days < 0 ? (
                            <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold mb-2">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              Overdue by {Math.abs(timeInfo.days)} Days
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] text-gray-600 font-bold mb-2">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              {timeInfo.days} Days Remaining
                            </div>
                          )}

                          {/* --- PROGRESS BAR CERDAS DI SINI --- */}
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-700 ease-out ${timeInfo.colorClass}`} 
                              style={{ width: `${timeInfo.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 mt-11">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Outstanding Fines</h3>
              
              {stats.totalFines === 0 ? (
                <>
                  <div className="w-14 h-14 bg-[#C6F6D5] rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-[#38A169]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p className="font-bold text-[#38A169] text-xs">No Outstanding Fines</p>
                  <p className="text-gray-500 text-xs mt-1">You're All Clear!</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <p className="font-bold text-red-500 text-sm">Rp {stats.totalFines.toLocaleString('id-ID')}</p>
                  <p className="text-gray-500 text-xs mt-1">Please pay at the admin desk.</p>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Digital Member ID</h3>
              <div className="w-full bg-[#E6FFFA] rounded-xl p-4 flex flex-col items-center">
                <div className="w-32 h-32 bg-white p-2 rounded shadow-sm flex items-center justify-center">
                   <svg width="100%" height="100%" viewBox="0 0 100 100" fill="black">
                     <rect x="0" y="0" width="30" height="30" />
                     <rect x="5" y="5" width="20" height="20" fill="white" />
                     <rect x="10" y="10" width="10" height="10" />
                     <rect x="70" y="0" width="30" height="30" />
                     <rect x="75" y="5" width="20" height="20" fill="white" />
                     <rect x="80" y="10" width="10" height="10" />
                     <rect x="0" y="70" width="30" height="30" />
                     <rect x="5" y="75" width="20" height="20" fill="white" />
                     <rect x="10" y="80" width="10" height="10" />
                     <rect x="40" y="0" width="10" height="10" />
                     <rect x="55" y="10" width="10" height="10" />
                     <rect x="40" y="25" width="25" height="10" />
                     <rect x="0" y="40" width="20" height="10" />
                     <rect x="30" y="45" width="40" height="10" />
                     <rect x="80" y="40" width="20" height="20" />
                     <rect x="50" y="65" width="20" height="20" />
                     <rect x="85" y="70" width="15" height="10" />
                     <rect x="70" y="85" width="20" height="15" />
                     <rect x="40" y="90" width="10" height="10" />
                   </svg>
                </div>
                <p className="text-[10px] text-gray-500 font-medium mt-3">Member ID</p>
                <p className="font-bold text-[#805AD5] text-lg leading-tight">{userData?.id || "N/A"}</p>
                <p className="text-[9px] text-gray-500 mt-2 max-w-[150px] leading-tight">Show this at the admin desk for quick checkout.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-sm text-gray-900 mb-5">Quick Stats</h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium w-16 leading-tight">Books Borrowed</span>
                  <span className="font-bold text-gray-900">{activeBooks.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium w-20 leading-tight">Books Read (All Time)</span>
                  <span className="font-bold text-gray-900">{stats.totalRead}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium">Member Status</span>
                  <span className={`font-bold ${userData?.isBlacklisted ? 'text-red-500' : 'text-green-500'}`}>
                    {userData?.isBlacklisted ? 'Blacklisted' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
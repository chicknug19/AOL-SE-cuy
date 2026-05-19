import React, { useState } from 'react';
import heroBook from '../assets/hero_book.png';
import book1 from '../assets/book_1.png';
import book2 from '../assets/book_2.png';

const Homepage = ({ onBookClick, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F2FBFA] font-sans text-gray-800 pb-12">
      
      {/* Top Navigation Bar */}
      <header className="bg-white py-3 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-50">
        
        {/* Logo & Title */}
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

        {/* Search Bar */}
        <div className="w-full max-w-md bg-white rounded-full flex items-center px-4 py-2 shadow-sm border border-gray-200 mb-4 md:mb-0">
          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search for books, authors, or topics" 
            className="w-full bg-transparent outline-none border-none ml-3 text-gray-700 placeholder-gray-400 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        {/* User Profile */}
        <div className="text-right flex flex-col items-end">
          <span className="text-[11px] text-gray-500">Welcome Back,</span>
          <span className="font-bold text-gray-900 text-sm">Brian Sanjaya</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
        
        {/* Alert Banner */}
        <div className="bg-[#FFF4E5] border border-[#F6AD55] rounded-lg p-4 mb-8 flex items-start gap-4">
          <div className="text-[#DD6B20] mt-0.5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[#C05621] text-sm md:text-base">1 Books Due Soon</h3>
            <p className="text-[#DD6B20] text-xs md:text-sm">Please return or renew your books before the due date to avoid fines.</p>
          </div>
        </div>

        {/* Hero Carousel */}
        <div className="relative w-full h-[300px] md:h-[400px] bg-[#9DBE99] rounded-xl overflow-hidden mb-10 flex justify-center items-center">
          {/* Main Hero Image */}
          <img src={heroBook} alt="Featured Book" className="h-[90%] md:h-[95%] object-contain shadow-2xl z-10" />
          
          {/* Left Arrow */}
          <button className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors z-20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          {/* Right Arrow */}
          <button className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors z-20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: My Books (Takes 8 columns on large screens) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Book Card 1 */}
            <div onClick={onBookClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 h-full cursor-pointer hover:shadow-md transition-shadow">
              <img src={book1} alt="Book" className="w-20 h-28 object-cover rounded shadow-sm flex-shrink-0" />
              <div className="flex flex-col justify-between py-1 w-full">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">To Kill a Mockingbird</h4>
                  <p className="text-xs text-gray-500 mt-1">Thomas H. Cormen</p> {/* Intentionally kept the mockup's funny author mixup or generic text */}
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Due: 22-10-2026
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    4 Days Remaining
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ECC94B] w-[80%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Card 2 */}
            <div onClick={onBookClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 h-full cursor-pointer hover:shadow-md transition-shadow">
              <img src={book2} alt="Book" className="w-20 h-28 object-cover rounded shadow-sm flex-shrink-0" />
              <div className="flex flex-col justify-between py-1 w-full">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">Lord of the Flies</h4>
                  <p className="text-xs text-gray-500 mt-1">William Golding</p>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Due: 12-10-2026
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    14 Days Remaining
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#48BB78] w-[30%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Card 3 */}
            <div onClick={onBookClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 h-full cursor-pointer hover:shadow-md transition-shadow">
              <img src={heroBook} alt="Book" className="w-20 h-28 object-cover rounded shadow-sm flex-shrink-0" />
              <div className="flex flex-col justify-between py-1 w-full">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">Harry Potter</h4>
                  <p className="text-xs text-gray-500 mt-1">J. K. Rowling</p>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Due: 10-10-2026
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    7 Days Remaining
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#48BB78] w-[50%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Card 4 */}
            <div onClick={onBookClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 h-full cursor-pointer hover:shadow-md transition-shadow">
              <img src={book2} alt="Book" className="w-20 h-28 object-cover rounded shadow-sm flex-shrink-0" />
              <div className="flex flex-col justify-between py-1 w-full">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">The Origin Of Species</h4>
                  <p className="text-xs text-gray-500 mt-1">Charles Darwin</p>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Due: 25-10-2026
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    1 Day Remaining
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E53E3E] w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Widgets (Takes 4 columns on large screens) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Outstanding Fines Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Outstanding Fines</h3>
              <div className="w-14 h-14 bg-[#C6F6D5] rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-[#38A169]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <p className="font-bold text-[#38A169] text-xs">No Outstanding Fines</p>
              <p className="text-gray-500 text-xs mt-1">You're All Clear!</p>
            </div>

            {/* Digital Member ID Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Digital Member ID</h3>
              <div className="w-full bg-[#E6FFFA] rounded-xl p-4 flex flex-col items-center">
                {/* Dummy QR Code using an SVG pattern */}
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
                <p className="font-bold text-[#805AD5] text-lg leading-tight">MM01</p>
                <p className="text-[9px] text-gray-500 mt-2 max-w-[150px] leading-tight">Show this at the admin desk for quick checkout.</p>
              </div>
            </div>

            {/* Quick Stats Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-sm text-gray-900 mb-5">Quick Stats</h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium w-16 leading-tight">Books Borrowed</span>
                  <span className="font-bold text-gray-900">4</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium w-20 leading-tight">Books Read (This Year)</span>
                  <span className="font-bold text-gray-900">23</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium">Member Since</span>
                  <span className="font-bold text-gray-900">2024</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Homepage;

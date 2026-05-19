import React from 'react';
import bookCrypto from './assets/book_crypto.png';

const BookDetail = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-900 pb-12">
      
      {/* Top Navigation / Back Link */}
      <div className="w-full border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4">
          <button 
            onClick={onBack}
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
        
        {/* Left Column: Book Cover (takes 5 columns on large screens) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <img 
            src={bookCrypto} 
            alt="The Book of Crypto" 
            className="w-full max-w-[400px] h-auto rounded-2xl shadow-xl object-cover"
          />
        </div>

        {/* Right Column: Book Details (takes 7 columns) */}
        <div className="lg:col-span-7 flex flex-col">
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">The Book of Crypto</h1>
          
          <p className="text-base text-gray-800 mb-2">
            <span className="font-bold">Author: </span>Henri Arslanian
          </p>
          <p className="text-base text-gray-800 mb-2">
            <span className="font-bold">Publication Year: </span>2018
          </p>
          <p className="text-base text-gray-800 mb-8">
            <span className="font-bold">ISBN: </span>120-3-873-17903-3
          </p>

          <h3 className="text-lg font-bold mb-3">Book Synopsis</h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-10 max-w-2xl">
            The Book of Crypto by Henri Arslanian provides an easy-to-understand introduction to cryptocurrencies and blockchain technology. It explains how digital assets like Bitcoin work, why they are important, and how they are changing the financial world. The book also discusses risks, regulations, and the future of crypto, making it suitable for beginners who want to understand this rapidly growing industry.
          </p>

          {/* Location & Availability Card */}
          <div className="border border-gray-300 rounded-xl p-6 md:p-8 max-w-lg">
            <h4 className="font-bold text-sm mb-4">Location & Availability</h4>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
                Borrowed
              </span>
              <span className="text-xs text-gray-400 font-medium">(4 copies)</span>
            </div>

            <div className="w-full h-px bg-gray-200 mb-6"></div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-xs font-bold text-gray-800 mb-1">Location:</p>
                <p className="text-xs text-gray-500">Business Section, Shelf A5, Row 7</p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default BookDetail;

import React, { useState } from 'react';
import heroBook from '../assets/hero_book.png';
import book1 from '../assets/book_1.png';
import book2 from '../assets/book_2.png';

const SearchPage = ({ initialQuery = '', onHome, onBookClick }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Mock Database
  const mockBooks = [
    { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', topic: 'Computer Science', image: book1 },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', topic: 'Computer Science', image: book2 },
    { id: 3, title: 'The Lean Startup', author: 'Eric Ries', topic: 'Business', image: heroBook },
    { id: 4, title: 'Harry Potter', author: 'J. K. Rowling', topic: 'Fantasy', image: heroBook },
    { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', topic: 'Classic', image: book1 },
    { id: 6, title: 'The Origin Of Species', author: 'Charles Darwin', topic: 'Science', image: book2 },
  ];

  const filteredBooks = mockBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#F3FCFC] font-sans text-gray-800 relative pb-12">
      
      {/* Top Header Background */}
      <div className="w-full h-48 bg-[#E3FAFA] absolute top-0 left-0 z-0"></div>
      
      {/* Top Navigation / Back Link */}
      <div className="relative z-20 w-full px-6 md:px-12 py-4">
        <button onClick={onHome} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2 px-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-6 drop-shadow-sm cursor-pointer hover:opacity-80 transition-opacity" onClick={onHome}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            {/* Simple logo icon */}
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
        <div className="w-full max-w-2xl bg-white rounded-2xl flex items-center px-6 py-4 shadow-sm border border-gray-100 mb-2">
          <svg className="w-5 h-5 text-gray-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search for books, authors, or topics" 
            className="w-full bg-transparent outline-none border-none ml-4 text-gray-700 placeholder-gray-400 font-medium text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dynamic Content: Default Dropdown OR Search Results */}
        {searchQuery.trim() === '' ? (
          /* Search Dropdown / Card (Default view) */
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mt-1">
            
            {/* Recent Searches */}
            <div className="p-5 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-500 text-xs">Recent Searches</h3>
                <button className="text-gray-400 hover:text-gray-600 text-xs font-semibold">Clear</button>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-800 font-bold cursor-pointer hover:bg-gray-50 rounded" onClick={() => setSearchQuery('Computer Science')}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Computer Science
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-800 font-bold cursor-pointer hover:bg-gray-50 rounded" onClick={() => setSearchQuery('Business')}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Business
                </li>
              </ul>
            </div>

            <div className="w-full h-[1px] bg-gray-100"></div>

            {/* Trending Now */}
            <div className="p-5 pt-4">
              <h3 className="font-bold text-gray-500 text-xs mb-3">Trending Now</h3>
              <div className="flex flex-wrap gap-2">
                <span 
                  className="px-4 py-1.5 bg-[#F0F2F5] text-gray-800 text-xs font-bold rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => setSearchQuery('Computer Science')}
                >
                  Computer Science
                </span>
                <span 
                  className="px-4 py-1.5 bg-[#F0F2F5] text-gray-800 text-xs font-bold rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => setSearchQuery('Business')}
                >
                  Business
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Search Results Grid */
          <div className="w-full max-w-4xl mt-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Search Results for "{searchQuery}"</h2>
            
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBooks.map((book) => (
                  <div key={book.id} onClick={onBookClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
                    <img src={book.image} alt={book.title} className="w-20 h-28 object-cover rounded shadow-sm flex-shrink-0" />
                    <div className="flex flex-col justify-center py-1">
                      <h4 className="font-bold text-base text-gray-900 leading-tight mb-1">{book.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                      <span className="inline-block bg-[#E6F4F1] text-[#2E8B57] text-xs font-bold px-2.5 py-1 rounded-md self-start">
                        {book.topic}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">No books found matching your search.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;

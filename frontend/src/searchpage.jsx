import React from 'react';

const SearchPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#F3FCFC] font-sans text-gray-800 relative">
      
      {/* Top Header Background */}
      <div className="w-full h-48 bg-[#E3FAFA] absolute top-0 left-0 z-0"></div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center pt-8 px-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-6 drop-shadow-sm">
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
          />
        </div>

        {/* Search Dropdown / Card */}
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mt-1">
          
          {/* Recent Searches */}
          <div className="p-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-500 text-xs">Recent Searches</h3>
              <button className="text-gray-400 hover:text-gray-600 text-xs font-semibold">Clear</button>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-800 font-bold cursor-pointer hover:bg-gray-50 rounded">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Artificial Intelligence
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-800 font-bold cursor-pointer hover:bg-gray-50 rounded">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Machine learning
              </li>
            </ul>
          </div>

          <div className="w-full h-[1px] bg-gray-100"></div>

          {/* Trending Now */}
          <div className="p-5 pt-4">
            <h3 className="font-bold text-gray-500 text-xs mb-3">Trending Now</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-[#F0F2F5] text-gray-800 text-xs font-bold rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                Computer Science
              </span>
              <span className="px-4 py-1.5 bg-[#F0F2F5] text-gray-800 text-xs font-bold rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                Business
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SearchPage;

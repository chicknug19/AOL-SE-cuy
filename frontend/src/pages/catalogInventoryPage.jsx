import React, { useState } from 'react';

const CatalogInventoryPage = ({ onLogout, onNavigate }) => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add' });
  return (
    <div className="flex w-full min-h-screen bg-[#F7F8FA] font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h2 className="font-bold text-sm tracking-wide text-black">Library Admin</h2>
        </div>
        
        <nav className="flex flex-col py-4">
          <button onClick={() => onNavigate('adminHome')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          <button onClick={() => onNavigate('adminBorrow')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Borrow Books
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          <button onClick={() => onNavigate('adminReturn')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            Return Books
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          <button onClick={() => onNavigate('adminMembers')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Members
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          {/* Active Link */}
          <button onClick={() => onNavigate('adminCatalogs')} className="flex items-center gap-3 px-6 py-3 border-l-4 border-black bg-gray-50 text-black font-bold text-sm text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Catalogs
          </button>
        </nav>
        
        {/* Logout at bottom */}
        <div className="mt-auto p-4">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 font-semibold py-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Bookuger Catalog Inventory</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and organize your library book collection</p>
        </header>

        {/* Filter and Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          
          {/* Search Input */}
          <div className="flex-grow flex items-center bg-white rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] px-5 py-3 max-w-2xl">
            <svg className="w-5 h-5 text-black font-bold mr-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by ISBN or Title" 
              className="flex-grow bg-transparent text-sm outline-none placeholder-gray-400 text-gray-700 font-medium"
            />
          </div>
          
          <div className="flex gap-4 items-center flex-wrap">
            {/* Dropdown */}
            <div className="bg-white rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] px-6 py-3 flex items-center justify-between min-w-[180px] cursor-pointer">
              <span className="text-sm font-semibold text-black">All Categories</span>
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Add Book Button */}
            <button 
              onClick={() => setModalState({ isOpen: true, mode: 'add' })}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 flex items-center gap-2 text-sm font-semibold transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              Add New Book
            </button>
          </div>
        </div>

        {/* Inventory Table Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden w-full">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black tracking-wide">Book Inventory (3)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ISBN</th>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Total<br/>Copies</th>
                  <th className="px-6 py-4">Available<br/>Copies</th>
                  <th className="px-6 py-4">Shelf<br/>Locations</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold">
                
                {/* Row 1 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-black">978-0-7432-7356-5</td>
                  <td className="px-6 py-5 text-gray-500">The Great Gatsby</td>
                  <td className="px-6 py-5 text-gray-500">F. Scott Fitzgerald</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-[#93C5FD] text-[#1E3A8A] w-20">
                      Fiction
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-500">3</td>
                  <td className="px-6 py-5 text-gray-500">3</td>
                  <td className="px-6 py-5 text-gray-500">A-01</td>
                  <td className="px-6 py-5 flex justify-center gap-4">
                    <button 
                      onClick={() => setModalState({ isOpen: true, mode: 'edit' })}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-black">978-0-452-28423-3</td>
                  <td className="px-6 py-5 text-gray-500">To Kill a Mockingbird</td>
                  <td className="px-6 py-5 text-gray-500">Harper Lee</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-[#93C5FD] text-[#1E3A8A] w-20">
                      Romance
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-500">2</td>
                  <td className="px-6 py-5 text-gray-500">4</td>
                  <td className="px-6 py-5 text-gray-500">A-15</td>
                  <td className="px-6 py-5 flex justify-center gap-4">
                    <button 
                      onClick={() => setModalState({ isOpen: true, mode: 'edit' })}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-black">978-0-14-143951-8</td>
                  <td className="px-6 py-5 text-gray-500">1984</td>
                  <td className="px-6 py-5 text-gray-500">George Orwell</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-[#93C5FD] text-[#1E3A8A] w-20">
                      Thriller
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-500">5</td>
                  <td className="px-6 py-5 text-gray-500">2</td>
                  <td className="px-6 py-5 text-gray-500">B-08</td>
                  <td className="px-6 py-5 flex justify-center gap-4">
                    <button 
                      onClick={() => setModalState({ isOpen: true, mode: 'edit' })}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          <div className="h-48 bg-white"></div> {/* Empty space to match the mockup's card height */}
        </div>

      </main>

      {/* Slide-over Overlay */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity" 
            onClick={() => setModalState({ isOpen: false, mode: 'add' })}
          ></div>

          {/* Panel */}
          <div className="relative w-full max-w-[400px] bg-white h-full shadow-2xl flex flex-col transform transition-transform overflow-y-auto z-10 border-l border-gray-200">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-start bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-bold text-black mb-1">
                  {modalState.mode === 'add' ? 'Add New Book' : 'Edit Book'}
                </h2>
                <p className="text-[11px] text-gray-500 font-medium">
                  {modalState.mode === 'add' ? 'Create New Inventory Item' : 'Edit Inventory Item'}
                </p>
              </div>
              <button 
                onClick={() => setModalState({ isOpen: false, mode: 'add' })}
                className="text-gray-400 hover:text-black transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-8 flex flex-col gap-5">
              {/* Book Cover Image */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Book Cover Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl bg-[#FAFAFA] flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-100 transition-colors">
                  <svg className="w-6 h-6 text-black mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <p className="text-[10px] font-bold text-black mb-0.5">Drop image here or click to upload</p>
                  <p className="text-[9px] text-gray-400 font-semibold">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* ISBN */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">ISBN</label>
                <input type="text" placeholder="978-X-XXXXX-XXX" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 transition-colors" />
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Book Title</label>
                <input type="text" placeholder="Enter book title" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 transition-colors" />
              </div>

              {/* Author */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Author Name</label>
                <input type="text" placeholder="Enter author name" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 transition-colors" />
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Publisher</label>
                <input type="text" placeholder="Enter publisher name" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 transition-colors" />
              </div>

              {/* Publication Year */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Publication Year</label>
                <input type="text" placeholder="YYYY" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 transition-colors" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Category Name</label>
                <div className="relative">
                  <select className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 appearance-none transition-colors font-semibold">
                    <option>Fiction</option>
                    <option>Romance</option>
                    <option>Thriller</option>
                  </select>
                  <svg className="w-3 h-3 text-black absolute right-3 top-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* Total Copies */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Total Copies</label>
                <div className="flex border border-gray-100 rounded-md bg-[#FAFAFA] overflow-hidden w-full transition-colors focus-within:border-blue-400 focus-within:bg-white">
                  <button className="px-4 py-2 text-black hover:bg-gray-200 font-bold text-sm">-</button>
                  <input type="text" value={modalState.mode === 'edit' ? '5' : '1'} readOnly className="flex-grow bg-transparent text-center text-xs font-bold outline-none text-black" />
                  <button className="px-4 py-2 text-black hover:bg-gray-200 font-bold text-sm">+</button>
                </div>
              </div>

              {/* Shelf Location */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Shelf Location</label>
                <input type="text" placeholder="A-01" className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 transition-colors" />
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-[11px] font-bold text-black mb-1.5">Book Synopsis / Description</label>
                <textarea rows="3" placeholder="Enter a brief description of the book..." className="w-full bg-[#FAFAFA] border border-gray-100 rounded-md px-3 py-2.5 text-xs outline-none focus:border-blue-400 focus:bg-white text-gray-700 resize-none transition-colors"></textarea>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-5 border-t border-gray-200 flex gap-4 mt-auto sticky bottom-0 bg-white z-10">
              <button className="flex-1 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-xs py-3 rounded-md transition-colors shadow-sm">
                {modalState.mode === 'add' ? 'Save Book' : 'Save Changes'}
              </button>
              <button 
                onClick={() => setModalState({ isOpen: false, mode: 'add' })}
                className="flex-1 bg-white border border-black text-black hover:bg-gray-50 font-bold text-xs py-3 rounded-md transition-colors"
              >
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

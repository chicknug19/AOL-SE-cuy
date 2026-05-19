import React from 'react';

const AdminMembersPage = ({ onLogout, onNavigate }) => {
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
          
          {/* Active Link */}
          <button onClick={() => onNavigate('adminMembers')} className="flex items-center gap-3 px-6 py-3 border-l-4 border-black bg-gray-50 text-black font-bold text-sm text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Members
          </button>
          
          <div className="w-full h-px bg-gray-200 my-1"></div>
          
          <button onClick={() => onNavigate('adminCatalogs')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
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
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Bookugers Member Management</h1>
          <p className="text-sm text-gray-500 font-medium">Manage And Monitor Library Members</p>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-grow flex items-center bg-white rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] px-4 py-3 max-w-2xl">
            <svg className="w-5 h-5 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by Member ID (NIM) or Name" 
              className="flex-grow bg-transparent text-sm outline-none placeholder-gray-400 text-gray-700 font-medium"
            />
          </div>
          
          {/* Dropdown */}
          <div className="bg-white rounded-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] px-6 py-3 flex items-center justify-between min-w-[200px] cursor-pointer">
            <span className="text-sm font-medium text-black">All Types</span>
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Members Table Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden w-full max-w-5xl">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black tracking-wide">Members (3)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-8 py-4">Member ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Active Borrowed Books</th>
                  <th className="px-6 py-4">Total Fines</th>
                  <th className="px-8 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                
                {/* Row 1 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-black">26012393</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">Jackson Fly</td>
                  <td className="px-6 py-5 text-gray-500">3</td>
                  <td className="px-6 py-5 text-gray-500">Rp 0</td>
                  <td className="px-8 py-5 flex justify-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#93C5FD] text-[#1E3A8A] w-24">
                      Borrowed
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-black">25309144</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">Michael Pilo</td>
                  <td className="px-6 py-5 text-gray-500">2</td>
                  <td className="px-6 py-5 text-[#F87171] font-medium">Rp 20.000</td>
                  <td className="px-8 py-5 flex justify-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#FCA5A5] text-[#991B1B] w-24">
                      Late
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-black">28328739</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">Jackson Swimmer</td>
                  <td className="px-6 py-5 text-gray-500">4</td>
                  <td className="px-6 py-5 text-gray-500">Rp 0</td>
                  <td className="px-8 py-5 flex justify-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#86EFAC] text-[#14532D] w-24">
                      Active
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          <div className="h-48 bg-white"></div> {/* Empty space to match the mockup's card height */}
        </div>

      </main>

    </div>
  );
};

export default AdminMembersPage;

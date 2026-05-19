import React from 'react';

const AdminHomepage = ({ onLogout, onNavigate }) => {
  return (
    <div className="flex w-full min-h-screen bg-[#F7F8FA] font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h2 className="font-bold text-sm tracking-wide text-black">Library Admin</h2>
        </div>
        
        <nav className="flex flex-col py-4">
          {/* Active Link */}
          <button onClick={() => onNavigate('adminHome')} className="flex items-center gap-3 px-6 py-3 border-l-4 border-black bg-gray-50 text-black font-bold text-sm text-left w-full">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
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
          
          <button onClick={() => onNavigate('adminCatalogs')} className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors text-sm font-semibold border-l-4 border-transparent text-left w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Catalogs
          </button>
        </nav>
        
        {/* Optional Logout at bottom */}
        <div className="mt-auto p-4">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 font-semibold py-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">Welcome to the library management system</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Stat Card: Total Books */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Total Books</p>
              <h3 className="text-3xl font-bold text-black">2,564</h3>
            </div>
            <div className="w-14 h-14 bg-[#819CFA] rounded-xl flex items-center justify-center text-white shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
          </div>

          {/* Stat Card: Currently Borrowed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Currently Borrowed</p>
              <h3 className="text-3xl font-bold text-black">250</h3>
            </div>
            <div className="w-14 h-14 bg-[#00FF3C] rounded-xl flex items-center justify-center text-white shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>

          {/* Stat Card: Active Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Active Members</p>
              <h3 className="text-3xl font-bold text-black">345</h3>
            </div>
            <div className="w-14 h-14 bg-[#B554FF] rounded-xl flex items-center justify-center text-white shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>

        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black tracking-wide">Recent Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-8 py-4">Member ID</th>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Borrow Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-8 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                
                {/* Row 1 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-black">M001</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">To Kill a Mockingbird</td>
                  <td className="px-6 py-5 text-gray-500">2026-04-10</td>
                  <td className="px-6 py-5 text-gray-500">2026-04-24</td>
                  <td className="px-8 py-5 flex justify-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#93C5FD] text-[#1E3A8A]">
                      Borrowed
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-black">M002</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">1984</td>
                  <td className="px-6 py-5 text-gray-500">2026-04-08</td>
                  <td className="px-6 py-5 text-gray-500">2026-04-22</td>
                  <td className="px-8 py-5 flex justify-center">
                    <span className="inline-flex items-center justify-center px-6 py-1.5 rounded-full text-xs font-bold bg-[#FCA5A5] text-[#991B1B]">
                      Late
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-black">M002</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">Pride and Prejudice</td>
                  <td className="px-6 py-5 text-gray-500">2026-04-15</td>
                  <td className="px-6 py-5 text-gray-500">2026-04-21</td>
                  <td className="px-8 py-5 flex justify-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#86EFAC] text-[#14532D]">
                      Returned
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

export default AdminHomepage;

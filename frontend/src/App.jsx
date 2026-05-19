import { useState } from 'react';
import Login from './pages/login';
import Homepage from './pages/homepage';
import BookDetail from './pages/bookDetail';
import SearchPage from './pages/searchpage';
import AdminLogin from './pages/adminLogin';
import AdminHomepage from './pages/adminHomepage';
import AdminBorrowpage from './pages/adminBorrowpage';
import ReturnBookspage from './pages/returnBookspage';
import AdminMembersPage from './pages/adminMembersPage';
import CatalogInventoryPage from './pages/catalogInventoryPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  if (currentPage === 'login') {
    return <Login onLogin={() => setCurrentPage('home')} onAdminClick={() => setCurrentPage('adminLogin')} />;
  }
  if (currentPage === 'adminLogin') {
    return <AdminLogin onLogin={() => setCurrentPage('adminHome')} onUserClick={() => setCurrentPage('login')} />;
  }
  if (currentPage === 'adminHome') {
    return <AdminHomepage onLogout={() => setCurrentPage('login')} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'adminBorrow') {
    return <AdminBorrowpage onLogout={() => setCurrentPage('login')} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'adminReturn') {
    return <ReturnBookspage onLogout={() => setCurrentPage('login')} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'adminMembers') {
    return <AdminMembersPage onLogout={() => setCurrentPage('login')} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'adminCatalogs') {
    return <CatalogInventoryPage onLogout={() => setCurrentPage('login')} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'detail') {
    return <BookDetail onBack={() => setCurrentPage('home')} />;
  }
  if (currentPage === 'search') {
    return <SearchPage initialQuery={globalSearchQuery} onHome={() => setCurrentPage('home')} onBookClick={() => setCurrentPage('detail')} />;
  }

  return (
    <Homepage 
      onBookClick={() => setCurrentPage('detail')} 
      onSearch={(query) => {
        setGlobalSearchQuery(query || '');
        setCurrentPage('search');
      }}
    />
  );
}

export default App;


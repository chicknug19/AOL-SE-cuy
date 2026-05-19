import { useState } from 'react';
import Login from './pages/login';
import Homepage from './pages/homepage';
import BookDetail from './pages/bookDetail';
import SearchPage from './pages/searchpage';
import AdminLogin from './pages/adminLogin';
import AdminHomepage from './pages/adminHomepage';

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
    return <AdminHomepage onLogout={() => setCurrentPage('login')} />;
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


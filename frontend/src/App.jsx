import { useState } from 'react';
import Login from './pages/login';
import Homepage from './pages/homepage';
import BookDetail from './pages/bookDetail';
import SearchPage from './pages/searchpage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  if (currentPage === 'login') {
    return <Login onLogin={() => setCurrentPage('home')} />;
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


import { useState } from 'react';
import Homepage from './homepage';
import BookDetail from './bookDetail';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'detail') {
    return <BookDetail onBack={() => setCurrentPage('home')} />;
  }

  return (
    <Homepage onBookClick={() => setCurrentPage('detail')} />
  );
}

export default App;


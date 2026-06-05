import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import semua halaman dari folder pages
// (Pastikan nama import ini persis sama dengan nama file yang baru kamu rename tadi)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutUsPage from './pages/AboutUsPage';
import SearchPage from './pages/SearchPage';
import BookDetailPage from './pages/BookDetailPage';
import CatalogMemberPage from './pages/CatalogMemberPage';

// Import halaman Admin
import AdminLoginPage from './pages/AdminLoginPage';
import AdminHomePage from './pages/AdminHomePage';
import AdminBorrowPage from './pages/AdminBorrowPage';
import ReturnBooksPage from './pages/ReturnBooksPage';
import AdminMembersPage from './pages/AdminMembersPage';
import CatalogInventoryPage from './pages/CatalogInventoryPage';

import ResetPasswordPage from './pages/ResetPasswordPage';
import RequestResetPage from './pages/RequestResetPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rute Publik & Mahasiswa */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<RequestResetPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/explore" element={<CatalogMemberPage />} />
        {/* URL dinamis untuk detail buku (id akan berubah-ubah) */}
        <Route path="/book/:id" element={<BookDetailPage />} /> 

        {/* Rute Khusus Admin */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminHomePage />} />
        <Route path="/admin/borrow" element={<AdminBorrowPage />} />
        <Route path="/admin/return" element={<ReturnBooksPage />} />
        <Route path="/admin/members" element={<AdminMembersPage />} />
        <Route path="/admin/catalog" element={<CatalogInventoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
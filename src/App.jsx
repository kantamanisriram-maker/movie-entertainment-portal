import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import AdminDashboard from './pages/AdminDashboard';
import ManageMovies from './pages/ManageMovies';
import ManageGenres from './pages/ManageGenres';
import Reviews from './pages/Reviews';
import About from './pages/About';

// Scroll to top on route change helper
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app-container">
      <ScrollToTop />
      {/* Universal Fixed Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<ManageMovies />} />
          <Route path="/admin/genres" element={<ManageGenres />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          {/* Catch-all route redirects to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Universal Website Footer */}
      <Footer />
    </div>
  );
}

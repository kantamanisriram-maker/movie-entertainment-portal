import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Info,
  Star,
  Film,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Layers,
  MessageSquare,
  ArrowRight,
  Search
} from 'lucide-react';
import { getMovies, getGenres, getReviews } from '../services/api';
import MovieCard from '../components/MovieCard';
import Modal from '../components/Modal';
import '../styles/Home.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hero carousel index
  const [heroIndex, setHeroIndex] = useState(0);

  // Search input on home page
  const [homeSearch, setHomeSearch] = useState('');
  const navigate = useNavigate();

  // Trailer modal state
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);

  // Fetch initial data from JSON Server
  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        setError(null);
        const [moviesData, genresData, reviewsData] = await Promise.all([
          getMovies(),
          getGenres(),
          getReviews(),
        ]);

        // Calculate average ratings for each movie from real reviews
        const moviesWithRatings = moviesData.map((movie) => {
          const movieReviews = reviewsData.filter(
            (r) => String(r.movieId) === String(movie.id)
          );
          let avgRating = 4.5; // default fallback if no reviews
          if (movieReviews.length > 0) {
            const sum = movieReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
            avgRating = sum / movieReviews.length;
          }
          return {
            ...movie,
            rating: avgRating,
            reviewCount: movieReviews.length,
          };
        });

        setMovies(moviesWithRatings);
        setGenres(genresData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Failed to connect to JSON Server at http://localhost:3000. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  // Auto-rotate hero featured movie every 7 seconds
  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 7000);
    return () => clearInterval(interval);
  }, [movies.length]);

  const handleHomeSearchSubmit = (e) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      navigate(`/movies?q=${encodeURIComponent(homeSearch.trim())}`);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Connecting to JSON Server & loading cinema catalogue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="card-glass" style={{ padding: '2.5rem', textAlign: 'center', borderColor: '#ef4444' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Backend Connection Error</h3>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '1.5rem' }}
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Filter lists for home shelves
  const featuredMovies = movies.slice(0, 5);
  const currentHero = featuredMovies[heroIndex] || movies[0];

  // Popular movies (highest review counts or top ratings)
  const popularMovies = [...movies]
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0) || b.rating - a.rating)
    .slice(0, 6);

  // Recently released movies (sorted by releaseYear descending)
  const recentlyReleased = [...movies]
    .sort((a, b) => Number(b.releaseYear) - Number(a.releaseYear))
    .slice(0, 6);

  // Top-rated movies (sorted by rating descending)
  const topRatedMovies = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Overall average platform rating
  const platformAvgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : '4.8';

  return (
    <div className="home-page-wrap">
      {/* 1. Cinematic Hero Section */}
      {currentHero && (
        <section className="hero-section">
          <div className="hero-backdrop">
            <img
              src={currentHero.backdrop || currentHero.poster}
              alt={currentHero.title}
              className="hero-bg-img"
            />
            <div className="hero-overlay" />
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 5 }}>
            <div className="hero-content">
              <div className="hero-badges">
                <span className="badge badge-red">
                  <Sparkles size={12} /> Spotlight Premiere
                </span>
                <span className="badge badge-purple">{currentHero.genre}</span>
                <span className="badge badge-gold">
                  <Star size={12} fill="currentColor" /> {Number(currentHero.rating).toFixed(1)} / 5.0
                </span>
              </div>

              <h1 className="hero-title">{currentHero.title}</h1>

              <div className="hero-meta">
                <span>{currentHero.releaseYear}</span>
                <span>•</span>
                <span>{currentHero.duration || 140} mins</span>
                <span>•</span>
                <span>{currentHero.language || 'English'}</span>
                <span>•</span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
                  Dir. {currentHero.director}
                </span>
              </div>

              <p className="hero-description">{currentHero.description}</p>

              <div className="hero-actions">
                {currentHero.trailer && (
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => setActiveTrailerMovie(currentHero)}
                  >
                    <Play size={18} fill="#fff" />
                    Watch Trailer
                  </button>
                )}
                <Link to={`/movies/${currentHero.id}`} className="btn btn-secondary btn-lg">
                  <Info size={18} />
                  View Details
                </Link>
              </div>

              {/* Hero Slider Dots */}
              <div className="hero-indicators">
                {featuredMovies.map((m, idx) => (
                  <button
                    key={m.id}
                    className={`hero-indicator-dot ${idx === heroIndex ? 'active' : ''}`}
                    onClick={() => setHeroIndex(idx)}
                    aria-label={`Show ${m.title}`}
                    title={m.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Interactive Quick Search Container */}
      <div className="container home-search-container">
        <form onSubmit={handleHomeSearchSubmit} className="search-bar-wrap">
          <Search size={22} className="search-icon-left" />
          <input
            type="text"
            className="search-input-box"
            placeholder="Search our vast collection by movie title, director, or actor..."
            value={homeSearch}
            onChange={(e) => setHomeSearch(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              position: 'absolute',
              right: '0.6rem',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.6rem 1.4rem'
            }}
          >
            Explore
          </button>
        </form>
      </div>

      {/* 3. Stats Ribbon Bar */}
      <section className="stats-ribbon">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon-wrap stat-icon-red">
                <Film size={26} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{movies.length}</span>
                <span className="stat-label">Total Movies</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap stat-icon-purple">
                <Layers size={26} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{genres.length}</span>
                <span className="stat-label">Movie Genres</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap stat-icon-gold">
                <MessageSquare size={26} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{reviews.length}</span>
                <span className="stat-label">User Reviews</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap stat-icon-cyan">
                <Star size={26} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{platformAvgRating}</span>
                <span className="stat-label">Avg Viewer Score</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Movies Section */}
      <section className="container movie-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-tag">Handpicked Selection</span>
            <h2 className="section-title">Featured Blockbusters</h2>
          </div>
          <Link to="/movies" className="btn btn-secondary btn-sm">
            View All Movies <ArrowRight size={14} />
          </Link>
        </div>
        <div className="movies-grid">
          {featuredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlayTrailer={() => setActiveTrailerMovie(movie)}
            />
          ))}
        </div>
      </section>

      {/* 5. Popular Movies Section */}
      <section className="container movie-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-tag">Audience Favorites</span>
            <h2 className="section-title">Popular Movies</h2>
          </div>
          <Link to="/movies" className="btn btn-secondary btn-sm">
            Explore More <ArrowRight size={14} />
          </Link>
        </div>
        <div className="movies-grid">
          {popularMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlayTrailer={() => setActiveTrailerMovie(movie)}
            />
          ))}
        </div>
      </section>

      {/* 6. Recently Released Movies Section */}
      <section className="container movie-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-tag">Fresh In Cinema</span>
            <h2 className="section-title">Recently Released Movies</h2>
          </div>
          <Link to="/movies" className="btn btn-secondary btn-sm">
            See Releases <ArrowRight size={14} />
          </Link>
        </div>
        <div className="movies-grid">
          {recentlyReleased.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlayTrailer={() => setActiveTrailerMovie(movie)}
            />
          ))}
        </div>
      </section>

      {/* 7. Top-Rated Movies Section */}
      <section className="container movie-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-tag">Critically Acclaimed</span>
            <h2 className="section-title">Top-Rated Masterpieces</h2>
          </div>
          <Link to="/movies" className="btn btn-secondary btn-sm">
            Full Rankings <ArrowRight size={14} />
          </Link>
        </div>
        <div className="movies-grid">
          {topRatedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlayTrailer={() => setActiveTrailerMovie(movie)}
            />
          ))}
        </div>
      </section>

      {/* Trailer Modal Player */}
      {activeTrailerMovie && (
        <Modal
          isOpen={Boolean(activeTrailerMovie)}
          onClose={() => setActiveTrailerMovie(null)}
          title={`${activeTrailerMovie.title} - Official Trailer`}
          maxWidth="850px"
        >
          <div className="video-frame-wrap">
            <iframe
              src={`${activeTrailerMovie.trailer}?autoplay=1`}
              title={`${activeTrailerMovie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

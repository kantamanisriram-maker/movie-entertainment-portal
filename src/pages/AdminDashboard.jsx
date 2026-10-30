import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Layers,
  MessageSquare,
  Star,
  Award,
  TrendingUp,
  Sliders,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { getMovies, getGenres, getReviews } from '../services/api';
import '../styles/Dashboard.css';

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        setError(null);
        const [moviesData, genresData, reviewsData] = await Promise.all([
          getMovies(),
          getGenres(),
          getReviews(),
        ]);

        // Calculate average rating per movie dynamically
        const moviesWithStats = moviesData.map((movie) => {
          const mReviews = reviewsData.filter((r) => String(r.movieId) === String(movie.id));
          const avg =
            mReviews.length > 0
              ? mReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / mReviews.length
              : 4.5;
          return {
            ...movie,
            averageRating: avg,
            reviewCount: mReviews.length,
          };
        });

        setMovies(moviesWithStats);
        setGenres(genresData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
        setError('Failed to fetch dashboard metrics from JSON Server.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Calculating dynamic platform analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="card-glass" style={{ padding: '2.5rem', textAlign: 'center', borderColor: '#ef4444' }}>
          <h3 style={{ color: '#ef4444' }}>Analytics Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 1. Total Movies
  const totalMovies = movies.length;

  // 2. Average Rating of all movies using submitted reviews
  const overallAvgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : '0.0';

  // 3. Highest Rated Movie (with poster & rating)
  const highestRatedMovie =
    movies.length > 0
      ? [...movies].sort((a, b) => b.averageRating - a.averageRating)[0]
      : null;

  // 4. Movies by Genre calculation
  const genreCounts = genres.map((genre) => {
    const count = movies.filter(
      (m) => (m.genre || '').toLowerCase() === (genre.name || '').toLowerCase()
    ).length;
    return {
      name: genre.name,
      count,
    };
  });

  const maxGenreCount = Math.max(...genreCounts.map((g) => g.count), 1);

  // Top 5 Highest Rated Movies
  const topRatedMovies = [...movies]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5);

  // Recently Added Movies (using reverse order of ID / array)
  const recentlyAddedMovies = [...movies].slice(-5).reverse();

  // Rating Distribution (1 to 5 stars)
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(Number(r.rating)) === stars).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Header with Quick Actions */}
      <div className="dashboard-hero">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-tag">Executive Portal</span>
            <h1 className="section-title" style={{ fontSize: '2.4rem' }}>
              Entertainment Analytics Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Real-time statistical overview computed dynamically from JSON Server database.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/movies" className="btn btn-primary btn-sm">
              <Plus size={16} /> Add New Movie
            </Link>
            <Link to="/admin/genres" className="btn btn-purple btn-sm">
              <Layers size={16} /> Manage Genres
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="dashboard-metrics-grid">
        {/* Metric 1: Total Movies */}
        <div className="metric-card card-glass border-red">
          <div className="metric-icon-box" style={{ background: 'rgba(229, 9, 20, 0.15)', color: 'var(--accent-red)' }}>
            <Film size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-val">{totalMovies}</span>
            <span className="metric-title">Total Movies In Catalog</span>
          </div>
        </div>

        {/* Metric 2: Average Rating */}
        <div className="metric-card card-glass border-gold">
          <div className="metric-icon-box" style={{ background: 'rgba(245, 197, 24, 0.15)', color: 'var(--accent-gold)' }}>
            <Star size={28} fill="currentColor" />
          </div>
          <div className="metric-content">
            <span className="metric-val">{overallAvgRating} <small style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</small></span>
            <span className="metric-title">Platform Average Rating</span>
          </div>
        </div>

        {/* Metric 3: Total Genres */}
        <div className="metric-card card-glass border-purple">
          <div className="metric-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
            <Layers size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-val">{genres.length}</span>
            <span className="metric-title">Active Film Genres</span>
          </div>
        </div>

        {/* Metric 4: Total Reviews */}
        <div className="metric-card card-glass border-cyan">
          <div className="metric-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <MessageSquare size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-val">{reviews.length}</span>
            <span className="metric-title">Community Reviews</span>
          </div>
        </div>
      </div>

      {/* Highest Rated Movie Showcase Card */}
      {highestRatedMovie && (
        <div className="highest-rated-showcase">
          <img
            src={highestRatedMovie.poster}
            alt={highestRatedMovie.title}
            className="showcase-poster"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="showcase-info">
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={16} /> #1 HIGHEST RATED CINEMA MASTERPIECE
            </span>
            <h2 className="showcase-title">{highestRatedMovie.title}</h2>
            <div className="showcase-meta">
              <span className="badge badge-purple">{highestRatedMovie.genre}</span>
              <span className="badge badge-gold">
                <Star size={13} fill="currentColor" /> {Number(highestRatedMovie.averageRating).toFixed(1)} / 5.0
              </span>
              <span>{highestRatedMovie.releaseYear}</span>
              <span>•</span>
              <span>Dir. {highestRatedMovie.director}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', marginTop: '0.4rem' }}>
              {highestRatedMovie.description}
            </p>
            <div style={{ marginTop: '0.75rem' }}>
              <Link to={`/movies/${highestRatedMovie.id}`} className="btn btn-gold btn-sm">
                <Eye size={15} /> Inspect Movie Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section: Movies by Genre Bar Chart + Rating Distribution */}
      <div className="dashboard-analytics-grid">
        {/* Movies By Genre Bar Chart */}
        <div className="chart-card card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--accent-purple)" /> Movies By Genre
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Distribution ({genreCounts.length} categories)
            </span>
          </div>

          <div className="bar-chart-container">
            {genreCounts.map((genre) => {
              const percentage = Math.round((genre.count / maxGenreCount) * 100);
              return (
                <div key={genre.name} className="bar-row">
                  <div className="bar-row-header">
                    <span className="bar-genre-name">{genre.name}</span>
                    <span className="bar-movie-count">
                      {genre.count} {genre.count === 1 ? 'movie' : 'movies'}
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill bar-fill-purple"
                      style={{ width: `${Math.max(percentage, genre.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="chart-card card-glass">
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} color="var(--accent-gold)" /> Audience Rating Breakdown
          </h3>

          <div className="rating-bars-wrap">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="bar-row">
                <div className="bar-row-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-gold)', fontSize: '0.85rem' }}>
                    {item.stars} <Star size={13} fill="currentColor" />
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {item.count} reviews ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      background: 'linear-gradient(90deg, #f5c518 0%, #f97316 100%)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Reviews Logged</span>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{reviews.length}</span>
          </div>
        </div>
      </div>

      {/* Activity Tables: Highest Rated + Recently Added */}
      <div className="dashboard-tables-grid">
        {/* Highest Rated Movies List */}
        <div className="table-card card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Highest-Rated Movies</h3>
            <Link to="/movies" className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Genre</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topRatedMovies.map((m) => (
                <tr key={m.id}>
                  <td>
                    <Link to={`/movies/${m.id}`} style={{ fontWeight: 600, color: '#fff' }}>
                      {m.title}
                    </Link>
                  </td>
                  <td>
                    <span className="badge badge-purple">{m.genre}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={13} fill="currentColor" /> {Number(m.averageRating).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recently Added Movies List */}
        <div className="table-card card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Recently Added Movies</h3>
            <Link to="/admin/movies" className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
              Manage <ArrowRight size={13} />
            </Link>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Release Year</th>
                <th>Director</th>
              </tr>
            </thead>
            <tbody>
              {recentlyAddedMovies.map((m) => (
                <tr key={m.id}>
                  <td>
                    <Link to={`/movies/${m.id}`} style={{ fontWeight: 600, color: '#fff' }}>
                      {m.title}
                    </Link>
                  </td>
                  <td>{m.releaseYear}</td>
                  <td>{m.director}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

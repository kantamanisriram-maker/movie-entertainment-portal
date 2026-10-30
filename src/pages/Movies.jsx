import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Film, Clapperboard, Frown, Sparkles } from 'lucide-react';
import { getMovies, getGenres, getReviews } from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import MovieFilter from '../components/MovieFilter';
import Modal from '../components/Modal';
import '../styles/Movies.css';

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Trailer Modal
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [moviesData, genresData, reviewsData] = await Promise.all([
          getMovies(),
          getGenres(),
          getReviews(),
        ]);

        // Attach calculated rating to each movie from reviews
        const enrichedMovies = moviesData.map((m) => {
          const mReviews = reviewsData.filter((r) => String(r.movieId) === String(m.id));
          const avg =
            mReviews.length > 0
              ? mReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / mReviews.length
              : 4.5;
          return {
            ...m,
            rating: avg,
            reviewCount: mReviews.length,
          };
        });

        setMovies(enrichedMovies);
        setGenres(genresData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Failed to load movies catalogue:', err);
        setError('Failed to load movies from the API. Please ensure JSON Server is running.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Sync searchQuery with URL query parameter
  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Compute available unique release years sorted descending
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(movies.map((m) => m.releaseYear).filter(Boolean)));
    return years.sort((a, b) => Number(b) - Number(a));
  }, [movies]);

  // Handle Search input change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedYear('');
    setSortBy('default');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedGenre || selectedYear || sortBy !== 'default'
  );

  // Filter and sort movies dynamically
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        // Keyword Search filter: Title, Director, Cast, Description
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = movie.title?.toLowerCase().includes(q);
          const matchDirector = movie.director?.toLowerCase().includes(q);
          const matchDesc = movie.description?.toLowerCase().includes(q);
          const matchCast = Array.isArray(movie.cast)
            ? movie.cast.some((c) => c.toLowerCase().includes(q))
            : String(movie.cast || '').toLowerCase().includes(q);

          if (!matchTitle && !matchDirector && !matchDesc && !matchCast) {
            return false;
          }
        }

        // Genre filter
        if (selectedGenre && movie.genre !== selectedGenre) {
          return false;
        }

        // Release year filter
        if (selectedYear && String(movie.releaseYear) !== String(selectedYear)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        if (sortBy === 'rating-asc') return a.rating - b.rating;
        if (sortBy === 'year-desc') return Number(b.releaseYear) - Number(a.releaseYear);
        if (sortBy === 'year-asc') return Number(a.releaseYear) - Number(b.releaseYear);
        if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
        return 0; // default order
      });
  }, [movies, searchQuery, selectedGenre, selectedYear, sortBy]);

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-tag">Explore Cinema</span>
          <h1 className="section-title" style={{ fontSize: '2.4rem' }}>
            Movie & Entertainment Catalogue
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Discover cinematic masterpieces, filter by genre and release era, and view audience reviews.
          </p>
        </div>
      </div>

      {/* Main Search Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleClearFilters}
          placeholder="Search by movie title, star cast, director, or keywords..."
        />
      </div>

      {/* Filter and Sorting Bar */}
      <MovieFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        availableYears={availableYears}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        resultsCount={filteredMovies.length}
      />

      {/* Loading state */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Retrieving movies from JSON Server...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="card-glass" style={{ padding: '2rem', textAlign: 'center', borderColor: '#ef4444' }}>
          <p style={{ color: '#ef4444' }}>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMovies.length === 0 && (
        <div className="empty-state card-glass">
          <div className="empty-state-icon">
            <Frown size={32} />
          </div>
          <h3>No Movies Found</h3>
          <p style={{ maxWidth: '480px' }}>
            We couldn't find any movies matching your current filters or search term "
            <strong>{searchQuery || selectedGenre || selectedYear}</strong>".
          </p>
          <button type="button" className="btn btn-primary" onClick={handleClearFilters}>
            Clear All Filters & Show All Movies
          </button>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && !error && filteredMovies.length > 0 && (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlayTrailer={() => setActiveTrailerMovie(movie)}
            />
          ))}
        </div>
      )}

      {/* Video Trailer Modal */}
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

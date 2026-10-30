import React, { useState, useEffect } from 'react';
import {
  Film,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  getGenres
} from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Admin.css';

const initialMovieForm = {
  title: '',
  description: '',
  genre: 'Sci-Fi',
  releaseYear: 2024,
  director: '',
  cast: '',
  duration: 120,
  language: 'English',
  poster: '',
  trailer: '',
};

export default function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState(null);
  const [formData, setFormData] = useState(initialMovieForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load movies and genres from JSON Server
  const loadData = async () => {
    try {
      setLoading(true);
      const [moviesData, genresData] = await Promise.all([
        getMovies(),
        getGenres(),
      ]);
      setMovies(moviesData);
      setGenres(genresData);
      if (genresData.length > 0 && !formData.genre) {
        setFormData((prev) => ({ ...prev, genre: genresData[0].name }));
      }
    } catch (err) {
      console.error('Error loading admin movies:', err);
      showNotification('Failed to fetch movies from JSON Server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Add Movie Modal
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentMovieId(null);
    setFormData({
      ...initialMovieForm,
      genre: genres.length > 0 ? genres[0].name : 'Sci-Fi',
      releaseYear: new Date().getFullYear(),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Movie Modal (Fetch latest from GET /movies/:id)
  const handleOpenEditModal = async (movie) => {
    try {
      setIsEditMode(true);
      setCurrentMovieId(movie.id);
      setFormErrors({});

      // Retrieve individual movie information using GET /movies/:id
      const freshMovie = await getMovieById(movie.id);
      setFormData({
        title: freshMovie.title || '',
        description: freshMovie.description || '',
        genre: freshMovie.genre || (genres[0]?.name || 'Sci-Fi'),
        releaseYear: freshMovie.releaseYear || 2024,
        director: freshMovie.director || '',
        cast: Array.isArray(freshMovie.cast)
          ? freshMovie.cast.join(', ')
          : freshMovie.cast || '',
        duration: freshMovie.duration || 120,
        language: freshMovie.language || 'English',
        poster: freshMovie.poster || '',
        trailer: freshMovie.trailer || '',
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to retrieve movie by ID for editing:', err);
      showNotification('Failed to fetch movie details for editing', 'error');
    }
  };

  // Form Field Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Movie title is required';
    } else if (formData.title.trim().length < 2) {
      errors.title = 'Title must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.genre) {
      errors.genre = 'Genre selection is required';
    }

    const year = Number(formData.releaseYear);
    if (!year || year < 1888 || year > 2035) {
      errors.releaseYear = 'Enter a valid release year (1888 - 2035)';
    }

    if (!formData.director.trim()) {
      errors.director = 'Director name is required';
    }

    const duration = Number(formData.duration);
    if (!duration || duration <= 0) {
      errors.duration = 'Duration must be greater than 0 minutes';
    }

    if (!formData.language.trim()) {
      errors.language = 'Language is required';
    }

    if (!formData.poster.trim()) {
      errors.poster = 'Poster image URL is required';
    }

    return errors;
  };

  // Submit Add or Edit Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      // Process cast string into array
      const castArray = formData.cast
        ? formData.cast.split(',').map((c) => c.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        genre: formData.genre,
        releaseYear: Number(formData.releaseYear),
        director: formData.director.trim(),
        cast: castArray,
        duration: Number(formData.duration),
        language: formData.language.trim(),
        poster: formData.poster.trim(),
        trailer: formData.trailer.trim(),
      };

      if (isEditMode) {
        // PUT /movies/:id
        const updated = await updateMovie(currentMovieId, payload);
        setMovies((prev) =>
          prev.map((m) => (String(m.id) === String(currentMovieId) ? { ...m, ...updated } : m))
        );
        showNotification(`Movie "${payload.title}" updated successfully!`);
      } else {
        // POST /movies
        const created = await addMovie(payload);
        setMovies((prev) => [created, ...prev]);
        showNotification(`Movie "${payload.title}" added to database!`);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving movie:', err);
      showNotification('Failed to save movie record. Please check JSON Server connection.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirmation Dialog
  const handleOpenDelete = (movie) => {
    setMovieToDelete(movie);
    setDeleteModalOpen(true);
  };

  // Execute DELETE /movies/:id
  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    setDeleting(true);
    try {
      await deleteMovie(movieToDelete.id);
      setMovies((prev) => prev.filter((m) => String(m.id) !== String(movieToDelete.id)));
      showNotification(`Movie "${movieToDelete.title}" deleted successfully!`);
      setDeleteModalOpen(false);
      setMovieToDelete(null);
    } catch (err) {
      console.error('Error deleting movie:', err);
      showNotification('Failed to delete movie from database', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filter movies for table view
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter ? movie.genre === genreFilter : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <span className="section-tag">Management Console</span>
          <h1 className="section-title" style={{ fontSize: '2.4rem' }}>
            Movie Inventory & CRUD Control
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Create, read, update, and delete cinema entries with live JSON Server synchronization.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add New Movie
        </button>
      </div>

      {/* Notification Toast Alert */}
      {notification && (
        <div
          style={{
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: notification.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${notification.type === 'error' ? '#ef4444' : '#10b981'}`,
            color: notification.type === 'error' ? '#f87171' : '#34d399',
          }}
        >
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontWeight: 600 }}>{notification.msg}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="card-glass" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="admin-toolbar" style={{ display: 'grid', gridTemplateColumns: '1fr 240px auto', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} className="search-icon-left" />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Filter by movie title or director..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All Genres ({movies.length})</option>
            {genres.map((g) => (
              <option key={g.id || g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Showing <strong>&nbsp;{filteredMovies.length}&nbsp;</strong> movies
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Syncing movies from JSON Server...</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="empty-state card-glass">
          <Film size={36} color="var(--accent-purple)" />
          <h4>No Movies Match Your Filter</h4>
          <p>Try clearing your search terms or add a new movie record.</p>
        </div>
      ) : (
        /* Movies Table View */
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Poster & Title</th>
                <th>Genre</th>
                <th>Release Year</th>
                <th>Director</th>
                <th>Duration</th>
                <th>Language</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <div className="admin-movie-cell">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="admin-table-poster"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="admin-movie-info">
                        <span className="admin-movie-title">{movie.title}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          ID: #{movie.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{movie.genre}</span>
                  </td>
                  <td>{movie.releaseYear}</td>
                  <td>{movie.director}</td>
                  <td>{movie.duration}m</td>
                  <td>{movie.language || 'English'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                      <a
                        href={`/movies/${movie.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        title="View Public Details"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <Eye size={15} />
                      </a>
                      <button
                        type="button"
                        className="btn btn-purple btn-sm"
                        onClick={() => handleOpenEditModal(movie)}
                        title="Edit Movie (PUT)"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenDelete(movie)}
                        title="Delete Movie (DELETE)"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Movie Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? `Edit Movie: ${formData.title}` : 'Add New Movie to Database'}
        maxWidth="720px"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-grid-2">
            {/* Movie Title */}
            <div className="form-group form-grid-full">
              <label className="form-label">
                Movie Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g., Inception"
                value={formData.title}
                onChange={handleInputChange}
              />
              {formErrors.title && (
                <span className="form-error">
                  <AlertCircle size={13} /> {formErrors.title}
                </span>
              )}
            </div>

            {/* Genre */}
            <div className="form-group">
              <label className="form-label">
                Genre <span className="required">*</span>
              </label>
              <select
                name="genre"
                className="form-select"
                value={formData.genre}
                onChange={handleInputChange}
              >
                {genres.map((g) => (
                  <option key={g.id || g.name} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
              {formErrors.genre && (
                <span className="form-error">
                  <AlertCircle size={13} /> {formErrors.genre}
                </span>
              )}
            </div>

            {/* Release Year */}
            <div className="form-group">
              <label className="form-label">
                Release Year <span className="required">*</span>
              </label>
              <input
                type="number"
                name="releaseYear"
                className="form-input"
                placeholder="2024"
                value={formData.releaseYear}
                onChange={handleInputChange}
              />
              {formErrors.releaseYear && (
                <span className="form-error">
                  <AlertCircle size={13} /> {formErrors.releaseYear}
                </span>
              )}
            </div>

            {/* Director */}
            <div className="form-group">
              <label className="form-label">
                Director <span className="required">*</span>
              </label>
              <input
                type="text"
                name="director"
                className="form-input"
                placeholder="e.g., Christopher Nolan"
                value={formData.director}
                onChange={handleInputChange}
              />
              {formErrors.director && (
                <span className="form-error">
                  <AlertCircle size={13} /> {formErrors.director}
                </span>
              )}
            </div>

            {/* Duration (mins) */}
            <div className="form-group">
              <label className="form-label">
                Duration (minutes) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="duration"
                className="form-input"
                placeholder="148"
                value={formData.duration}
                onChange={handleInputChange}
              />
              {formErrors.duration && (
                <span className="form-error">
                  <AlertCircle size={13} /> {formErrors.duration}
                </span>
              )}
            </div>

            {/* Language */}
            <div className="form-group">
              <label className="form-label">
                Language <span className="required">*</span>
              </label>
              <input
                type="text"
                name="language"
                className="form-input"
                placeholder="English, Spanish, etc."
                value={formData.language}
                onChange={handleInputChange}
              />
              {formErrors.language && (
                <span className="form-error">
                  <AlertCircle size={13} /> {formErrors.language}
                </span>
              )}
            </div>

            {/* Cast (comma-separated) */}
            <div className="form-group">
              <label className="form-label">Cast (comma separated)</label>
              <input
                type="text"
                name="cast"
                className="form-input"
                placeholder="Leonardo DiCaprio, Tom Hardy, Elliot Page"
                value={formData.cast}
                onChange={handleInputChange}
              />
            </div>

            {/* Description */}
            <div className="form-group form-grid-full">
              <label className="form-label">
                Description & Synopsis <span className="required">*</span>
              </label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Provide a comprehensive synopsis of the movie plot..."
                value={formData.description}
                onChange={handleInputChange}
              />
              {formErrors.description && (
                <span className="form-error">
                  <AlertCircle size={13} /> {formErrors.description}
                </span>
              )}
            </div>

            {/* Poster Image URL */}
            <div className="form-group form-grid-full">
              <label className="form-label">
                Poster Image URL <span className="required">*</span>
              </label>
              <input
                type="url"
                name="poster"
                className="form-input"
                placeholder="https://images.unsplash.com/... or poster image link"
                value={formData.poster}
                onChange={handleInputChange}
              />
              {formErrors.poster && (
                <span className="form-error">
                  <AlertCircle size={13} /> {formErrors.poster}
                </span>
              )}

              {/* Live Poster Image Preview */}
              <div className="poster-preview-box">
                {formData.poster ? (
                  <img
                    src={formData.poster}
                    alt="Poster Preview"
                    className="poster-preview-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="poster-preview-empty">
                    <ImageIcon size={28} />
                    <span>Live poster preview will show here once URL is entered</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trailer URL */}
            <div className="form-group form-grid-full">
              <label className="form-label">Trailer URL (YouTube embed or video URL)</label>
              <input
                type="url"
                name="trailer"
                className="form-input"
                placeholder="https://www.youtube.com/embed/..."
                value={formData.trailer}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving to JSON Server...' : isEditMode ? 'Update Movie' : 'Save Movie'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Movie Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Movie"
        itemName={movieToDelete?.title}
        message="Are you sure you want to permanently delete this movie from db.json? This operation sends a DELETE HTTP request to JSON Server."
        loading={deleting}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Film,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  getGenres,
  addGenre,
  updateGenre,
  deleteGenre,
  getMovies
} from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Admin.css';

export default function ManageGenres() {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentGenreId, setCurrentGenreId] = useState(null);
  const [genreName, setGenreName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [genresData, moviesData] = await Promise.all([
        getGenres(),
        getMovies(),
      ]);
      setGenres(genresData);
      setMovies(moviesData);
    } catch (err) {
      console.error('Failed to load genres and movies:', err);
      showNotification('Failed to fetch genres from JSON Server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute how many movies belong to each genre
  const getMovieCountForGenre = (genreTitle) => {
    if (!genreTitle) return 0;
    return movies.filter(
      (m) => (m.genre || '').trim().toLowerCase() === genreTitle.trim().toLowerCase()
    ).length;
  };

  // Open Add Genre Modal
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setCurrentGenreId(null);
    setGenreName('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Genre Modal
  const handleOpenEdit = (genre) => {
    setIsEditMode(true);
    setCurrentGenreId(genre.id);
    setGenreName(genre.name);
    setFormError('');
    setIsModalOpen(true);
  };

  // Submit Add or Edit
  const handleSubmitGenre = async (e) => {
    e.preventDefault();

    if (!genreName.trim()) {
      setFormError('Genre name is required');
      return;
    }

    // Check duplicate name
    const isDuplicate = genres.some(
      (g) =>
        g.name.toLowerCase() === genreName.trim().toLowerCase() &&
        String(g.id) !== String(currentGenreId)
    );
    if (isDuplicate) {
      setFormError('A genre with this name already exists');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        // PUT /genres/:id
        const updated = await updateGenre(currentGenreId, { name: genreName.trim() });
        setGenres((prev) =>
          prev.map((g) => (String(g.id) === String(currentGenreId) ? updated : g))
        );
        showNotification(`Genre "${genreName.trim()}" updated successfully!`);
      } else {
        // POST /genres
        const created = await addGenre({ name: genreName.trim() });
        setGenres((prev) => [...prev, created]);
        showNotification(`Genre "${genreName.trim()}" added to database!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving genre:', err);
      setFormError('Failed to save genre to JSON Server.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Dialog
  const handleOpenDelete = (genre) => {
    setGenreToDelete(genre);
    setDeleteModalOpen(true);
  };

  // Confirm DELETE /genres/:id
  const handleConfirmDelete = async () => {
    if (!genreToDelete) return;
    setDeleting(true);
    try {
      await deleteGenre(genreToDelete.id);
      setGenres((prev) => prev.filter((g) => String(g.id) !== String(genreToDelete.id)));
      showNotification(`Genre "${genreToDelete.name}" deleted from database!`);
      setDeleteModalOpen(false);
      setGenreToDelete(null);
    } catch (err) {
      console.error('Error deleting genre:', err);
      showNotification('Failed to delete genre from database', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <span className="section-tag">Category Architecture</span>
          <h1 className="section-title" style={{ fontSize: '2.4rem' }}>
            Movie Genre Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Organize film categories, track movie counts per genre, and manage records via JSON Server REST APIs.
          </p>
        </div>

        <button type="button" className="btn btn-purple" onClick={handleOpenAdd}>
          <Plus size={18} /> Add New Genre
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

      {/* Loading state */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Retrieving genre categories...</p>
        </div>
      ) : (
        /* Genre Cards Grid with Movie Count per Genre */
        <div className="genre-cards-grid">
          {genres.map((genre) => {
            const movieCount = getMovieCountForGenre(genre.name);
            return (
              <div key={genre.id} className="genre-card card-glass">
                <div className="genre-card-header">
                  <div>
                    <h3 className="genre-card-name">{genre.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ID: #{genre.id}
                    </span>
                  </div>

                  {/* Movie Count Badge */}
                  <span
                    className="badge badge-purple"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Film size={12} />
                    {movieCount} {movieCount === 1 ? 'Movie' : 'Movies'}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Active category for classifying films in the CineVerse platform.
                </p>

                <div className="genre-card-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEdit(genre)}
                    style={{ flex: 1 }}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleOpenDelete(genre)}
                    style={{ flex: 1 }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Genre Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Edit Genre Category' : 'Create New Film Genre'}
        maxWidth="500px"
      >
        <form onSubmit={handleSubmitGenre}>
          <div className="form-group">
            <label className="form-label">
              Genre Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Psychological Thriller, Sci-Fi, Mystery"
              value={genreName}
              onChange={(e) => {
                setGenreName(e.target.value);
                setFormError('');
              }}
              autoFocus
            />
            {formError && (
              <span className="form-error">
                <AlertCircle size={13} /> {formError}
              </span>
            )}
          </div>

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
              {submitting ? 'Saving...' : isEditMode ? 'Update Genre' : 'Save Genre'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Genre Confirm Dialog */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Genre"
        itemName={genreToDelete?.name}
        message="Are you sure you want to permanently delete this genre? Any movie assigned to this genre will retain its tag until updated."
        loading={deleting}
      />
    </div>
  );
}

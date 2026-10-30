import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  Film,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  getReviews,
  getMovies,
  updateReview,
  deleteReview
} from '../services/api';
import ReviewCard from '../components/ReviewCard';
import RatingStars from '../components/RatingStars';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [movieFilter, setMovieFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  // Edit Review Modal
  const [editingReview, setEditingReview] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete Review Modal
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reviewsData, moviesData] = await Promise.all([
        getReviews(),
        getMovies(),
      ]);
      setReviews(reviewsData);
      setMovies(moviesData);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError('Failed to fetch reviews from JSON Server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map movieId to movie title
  const getMovieTitle = (movieId) => {
    const found = movies.find((m) => String(m.id) === String(movieId));
    return found ? found.title : `Movie #${movieId}`;
  };

  // Open Edit Review
  const handleStartEdit = (rev) => {
    setEditingReview(rev);
    setEditName(rev.reviewerName);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  // Save Edit Review
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editComment.trim()) return;

    setEditLoading(true);
    try {
      const updated = {
        ...editingReview,
        reviewerName: editName.trim(),
        rating: Number(editRating),
        comment: editComment.trim(),
      };
      await updateReview(editingReview.id, updated);
      setReviews((prev) =>
        prev.map((r) => (r.id === editingReview.id ? updated : r))
      );
      showNotification('Review updated successfully!');
      setEditingReview(null);
    } catch (err) {
      console.error('Failed to update review:', err);
      showNotification('Failed to update review in JSON Server', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Review
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await deleteReview(deletingId);
      setReviews((prev) => prev.filter((r) => r.id !== deletingId));
      showNotification('Review deleted from database!');
      setDeletingId(null);
    } catch (err) {
      console.error('Failed to delete review:', err);
      showNotification('Failed to delete review from database', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesMovie = movieFilter ? String(r.movieId) === String(movieFilter) : true;
    const matchesRating = ratingFilter ? Number(r.rating) === Number(ratingFilter) : true;
    return matchesMovie && matchesRating;
  });

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-tag">Community Hub</span>
          <h1 className="section-title" style={{ fontSize: '2.4rem' }}>
            Audience Reviews & Ratings
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Browse viewer critiques, manage review feedback, and filter across the movie library.
          </p>
        </div>
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

      {/* Filter Bar */}
      <div className="card-glass" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Movie Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Film</label>
            <select
              className="form-select"
              value={movieFilter}
              onChange={(e) => setMovieFilter(e.target.value)}
            >
              <option value="">All Movies ({reviews.length} reviews)</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Rating</label>
            <select
              className="form-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars (Masterpiece)</option>
              <option value="4">4 Stars (Great)</option>
              <option value="3">3 Stars (Good)</option>
              <option value="2">2 Stars (Average)</option>
              <option value="1">1 Star (Poor)</option>
            </select>
          </div>

          {/* Reset Action */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setMovieFilter('');
                setRatingFilter('');
              }}
              style={{ width: '100%', marginTop: 'auto' }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading community reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="empty-state card-glass">
          <MessageSquare size={36} color="var(--accent-purple)" />
          <h4>No Reviews Found</h4>
          <p>No audience reviews match your selected filters.</p>
        </div>
      ) : (
        <div className="reviews-list">
          {filteredReviews.map((rev) => (
            <ReviewCard
              key={rev.id}
              review={rev}
              movieTitle={getMovieTitle(rev.movieId)}
              showMovieTitle={true}
              onEdit={handleStartEdit}
              onDelete={(id) => setDeletingId(id)}
            />
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <Modal
          isOpen={Boolean(editingReview)}
          onClose={() => setEditingReview(null)}
          title="Edit Review"
          maxWidth="560px"
        >
          <form onSubmit={handleSaveEdit}>
            <div className="form-group">
              <label className="form-label">Reviewer Name</label>
              <input
                type="text"
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rating</label>
              <RatingStars
                rating={editRating}
                size={24}
                interactive={true}
                onChange={(val) => setEditRating(val)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea
                className="form-textarea"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingReview(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Review Confirm Dialog */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        message="Are you sure you want to remove this review permanently from JSON Server?"
        loading={deleteLoading}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Clock,
  Globe,
  Film,
  Play,
  Calendar,
  User,
  Sparkles,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getMovieById, getReviews, addReview, deleteReview, updateReview } from '../services/api';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Movies.css';

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form States
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Edit Review Modal States
  const [editingReview, setEditingReview] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete Review Modal States
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Video Trailer Modal
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Load movie and reviews
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError(null);
        const [movieData, allReviews] = await Promise.all([
          getMovieById(id),
          getReviews(`movieId=${id}`),
        ]);

        setMovie(movieData);
        setReviews(allReviews);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Could not load movie information. Please check if JSON Server is running.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // Calculate dynamic average rating from reviews
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : '5.0';

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!reviewerName.trim()) {
      errors.reviewerName = 'Reviewer name is required';
    }
    if (!comment.trim()) {
      errors.comment = 'Please write a review comment';
    } else if (comment.trim().length < 5) {
      errors.comment = 'Review comment must be at least 5 characters';
    }
    if (!rating || rating < 1 || rating > 5) {
      errors.rating = 'Please provide a rating between 1 and 5 stars';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    try {
      const newReview = {
        movieId: String(id),
        reviewerName: reviewerName.trim(),
        rating: Number(rating),
        comment: comment.trim(),
        date: new Date().toISOString().split('T')[0],
      };

      const createdReview = await addReview(newReview);

      // Automatically update the UI and recalculate the average rating!
      setReviews((prev) => [createdReview, ...prev]);

      // Reset form
      setReviewerName('');
      setComment('');
      setRating(5);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setFormErrors({ submit: 'Failed to post review. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Review
  const handleStartEditReview = (rev) => {
    setEditingReview(rev);
    setEditName(rev.reviewerName);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  // Submit Edited Review
  const handleSaveEditReview = async (e) => {
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
      setEditingReview(null);
    } catch (err) {
      console.error('Failed to update review:', err);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Review
  const handleConfirmDeleteReview = async () => {
    if (!deletingReviewId) return;
    setDeleteLoading(true);
    try {
      await deleteReview(deletingReviewId);
      setReviews((prev) => prev.filter((r) => r.id !== deletingReviewId));
      setDeletingReviewId(null);
    } catch (err) {
      console.error('Failed to delete review:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading cinema details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card-glass" style={{ padding: '3rem', maxWidth: '540px', margin: '0 auto' }}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h3>Movie Not Found</h3>
          <p style={{ margin: '1rem 0 1.5rem' }}>{error || 'Unable to locate this movie.'}</p>
          <Link to="/movies" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Movie Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const castList = Array.isArray(movie.cast)
    ? movie.cast
    : String(movie.cast || '').split(',').map((c) => c.trim()).filter(Boolean);

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/movies" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Movies
        </Link>
      </div>

      {/* Hero Showcase for Movie Details */}
      <div className="movie-details-hero">
        <div className="details-backdrop">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="details-backdrop-img"
          />
          <div className="details-backdrop-overlay" />
        </div>

        <div className="details-content-wrap">
          {/* Left Poster */}
          <div className="details-poster-box">
            <img
              src={movie.poster}
              alt={movie.title}
              className="details-poster-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>

          {/* Right Movie Information */}
          <div className="details-info">
            <div className="details-header">
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="badge badge-purple">{movie.genre}</span>
                <span className="badge badge-gold">
                  <Star size={13} fill="currentColor" /> {averageRating} / 5.0 ({reviews.length} reviews)
                </span>
                <span className="badge badge-cyan">{movie.language || 'English'}</span>
              </div>

              <h1 className="details-title">{movie.title}</h1>

              <div className="details-meta-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} /> {movie.releaseYear}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} /> {movie.duration || 135} mins
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Globe size={15} /> {movie.language || 'English'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="details-description-box">
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Synopsis & Overview
              </h4>
              <p style={{ lineHeight: '1.7', fontSize: '1.02rem' }}>{movie.description}</p>
            </div>

            {/* Cast & Director Credits */}
            <div className="details-credits-grid">
              <div className="credit-item">
                <span className="credit-title">Directed By</span>
                <span className="credit-val">{movie.director}</span>
              </div>

              <div className="credit-item">
                <span className="credit-title">Principal Cast</span>
                <div className="cast-tags">
                  {castList.length > 0 ? (
                    castList.map((actor, idx) => (
                      <span key={idx} className="cast-tag">
                        {actor}
                      </span>
                    ))
                  ) : (
                    <span className="credit-val">Ensemble Cast</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {movie.trailer && (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowTrailerModal(true)}
                >
                  <Play size={18} fill="#fff" /> Watch Official Trailer
                </button>
              )}
              <a href="#reviews-section" className="btn btn-secondary btn-lg">
                <MessageSquare size={18} /> Audience Reviews ({reviews.length})
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Trailer Section */}
      {movie.trailer && (
        <section className="trailer-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-tag">Cinematic Preview</span>
              <h3 className="section-title">Official Movie Trailer</h3>
            </div>
          </div>
          <div className="video-frame-wrap">
            <iframe
              src={movie.trailer}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Ratings and Reviews Section */}
      <section id="reviews-section" className="reviews-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-tag">Community Feedback</span>
            <h2 className="section-title">Audience Ratings & Reviews</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Overall Score: <strong>{averageRating} / 5.0</strong> based on <strong>{reviews.length}</strong> viewer reviews.
            </p>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="review-form-card card-glass">
          <h3 style={{ marginBottom: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-gold)" /> Write Your Movie Review
          </h3>

          {submitSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#34d399',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <CheckCircle size={18} />
              <span>Thank you! Your review has been saved to JSON Server and ratings updated.</span>
            </div>
          )}

          {formErrors.submit && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#f87171',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem'
            }}>
              {formErrors.submit}
            </div>
          )}

          <form onSubmit={handleReviewSubmit}>
            <div className="form-grid-2">
              {/* Reviewer Name */}
              <div className="form-group">
                <label className="form-label">
                  Your Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Shanmukhasriram Kantamani"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />
                {formErrors.reviewerName && (
                  <span className="form-error">
                    <AlertCircle size={13} /> {formErrors.reviewerName}
                  </span>
                )}
              </div>

              {/* Five Star Interactive Rating */}
              <div className="form-group">
                <label className="form-label">
                  Rating (Select 1 to 5 Stars) <span className="required">*</span>
                </label>
                <div style={{ padding: '0.4rem 0' }}>
                  <RatingStars
                    rating={rating}
                    size={28}
                    interactive={true}
                    onChange={(newVal) => setRating(newVal)}
                  />
                </div>
                {formErrors.rating && (
                  <span className="form-error">
                    <AlertCircle size={13} /> {formErrors.rating}
                  </span>
                )}
              </div>

              {/* Review Comment Text */}
              <div className="form-group form-grid-full">
                <label className="form-label">
                  Review Comment <span className="required">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Share your thoughts about the movie plot, direction, acting, and cinematography..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                {formErrors.comment && (
                  <span className="form-error">
                    <AlertCircle size={13} /> {formErrors.comment}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ marginTop: '0.5rem' }}
            >
              {submitting ? 'Submitting to JSON Server...' : 'Submit Movie Review'}
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="empty-state card-glass">
              <MessageSquare size={36} color="var(--accent-purple)" />
              <h4>No Reviews Yet</h4>
              <p>Be the very first audience member to review {movie.title}!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <ReviewCard
                key={rev.id}
                review={rev}
                onEdit={handleStartEditReview}
                onDelete={(revId) => setDeletingReviewId(revId)}
              />
            ))
          )}
        </div>
      </section>

      {/* Edit Review Modal */}
      {editingReview && (
        <Modal
          isOpen={Boolean(editingReview)}
          onClose={() => setEditingReview(null)}
          title="Edit Review"
          maxWidth="560px"
        >
          <form onSubmit={handleSaveEditReview}>
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
        isOpen={Boolean(deletingReviewId)}
        onClose={() => setDeletingReviewId(null)}
        onConfirm={handleConfirmDeleteReview}
        title="Delete Review"
        message="Are you sure you want to remove this audience review from the database?"
        loading={deleteLoading}
      />

      {/* Trailer Modal Player */}
      {showTrailerModal && (
        <Modal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          title={`${movie.title} - Official Trailer`}
          maxWidth="850px"
        >
          <div className="video-frame-wrap">
            <iframe
              src={`${movie.trailer}?autoplay=1`}
              title={`${movie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

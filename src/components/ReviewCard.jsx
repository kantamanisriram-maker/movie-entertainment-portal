import React from 'react';
import { Trash2, Edit3, User, Calendar } from 'lucide-react';
import RatingStars from './RatingStars';

export default function ReviewCard({
  review,
  movieTitle = '',
  onEdit = null,
  onDelete = null,
  showMovieTitle = false,
}) {
  if (!review) return null;

  // Extract initials for reviewer avatar
  const initials = review.reviewerName
    ? review.reviewerName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const formattedDate = review.date ? new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Recent';

  return (
    <div className="review-card card-glass">
      <div className="review-card-header">
        <div className="reviewer-profile">
          <div className="reviewer-avatar">{initials}</div>
          <div>
            <div className="reviewer-name">{review.reviewerName || 'Anonymous Viewer'}</div>
            <div className="review-date" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={12} />
              {formattedDate}
              {showMovieTitle && movieTitle && (
                <span style={{ color: 'var(--accent-purple)', marginLeft: '0.4rem', fontWeight: 600 }}>
                  • on {movieTitle}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <RatingStars rating={review.rating} size={16} />

          {(onEdit || onDelete) && (
            <div className="admin-actions">
              {onEdit && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(review)}
                  title="Edit Review"
                  style={{ padding: '0.35rem 0.5rem' }}
                >
                  <Edit3 size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(review.id)}
                  title="Delete Review"
                  style={{ padding: '0.35rem 0.5rem' }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="review-comment">{review.comment}</p>
    </div>
  );
}

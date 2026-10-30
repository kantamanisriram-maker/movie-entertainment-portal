import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * RatingStars Component
 * Supports both interactive star selection for review forms and display-only rating mode
 */
export default function RatingStars({
  rating = 0,
  maxStars = 5,
  size = 18,
  interactive = false,
  onChange = () => {},
  showValue = true,
  className = '',
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={`rating-stars-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
        {Array.from({ length: maxStars }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(displayRating);

          if (interactive) {
            return (
              <button
                key={index}
                type="button"
                className={`star-interactive-btn ${starValue <= displayRating ? 'active' : ''}`}
                onClick={() => onChange(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${starValue} out of ${maxStars}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'inline-flex',
                }}
              >
                <Star
                  size={size}
                  fill={isFilled ? 'var(--accent-gold)' : 'transparent'}
                  color={isFilled ? 'var(--accent-gold)' : '#475569'}
                  style={{ transition: 'all 0.15s ease' }}
                />
              </button>
            );
          }

          return (
            <Star
              key={index}
              size={size}
              fill={isFilled ? 'var(--accent-gold)' : 'transparent'}
              color={isFilled ? 'var(--accent-gold)' : '#334155'}
            />
          );
        })}
      </div>

      {showValue && (
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--accent-gold)',
          marginLeft: '0.3rem'
        }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}

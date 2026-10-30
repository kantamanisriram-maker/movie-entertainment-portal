import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Play, Film, ArrowRight } from 'lucide-react';

export default function MovieCard({ movie, onPlayTrailer }) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  if (!movie) return null;

  // Rating fallback if not computed yet
  const rating = movie.rating !== undefined ? Number(movie.rating).toFixed(1) : '4.5';

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(movie);
    } else {
      navigate(`/movies/${movie.id}`);
    }
  };

  return (
    <div className="movie-card">
      <Link to={`/movies/${movie.id}`} className="movie-poster-wrap">
        {!imageError && movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-poster-img"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="poster-fallback">
            <Film size={36} color="var(--accent-purple)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{movie.title}</span>
          </div>
        )}

        <div className="poster-badges">
          <span className="rating-badge">
            <Star size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
            {rating}
          </span>
          <span className="genre-pill">{movie.genre || 'Cinema'}</span>
        </div>

        {movie.trailer && (
          <div className="poster-play-overlay">
            <button
              className="play-circle-btn"
              onClick={handlePlayClick}
              title="Watch Trailer"
              aria-label={`Play trailer for ${movie.title}`}
            >
              <Play size={22} fill="#fff" />
            </button>
          </div>
        )}
      </Link>

      <div className="movie-card-info">
        <h3 className="movie-card-title" title={movie.title}>
          <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
        </h3>

        <div className="movie-card-meta">
          <span>{movie.releaseYear || 'N/A'}</span>
          {movie.duration && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} />
              {movie.duration}m
            </span>
          )}
        </div>

        <div className="movie-card-details-btn">
          <Link to={`/movies/${movie.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            View Details
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

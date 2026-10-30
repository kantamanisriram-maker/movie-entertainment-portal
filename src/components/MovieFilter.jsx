import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Calendar, Film } from 'lucide-react';

export default function MovieFilter({
  genres = [],
  selectedGenre = '',
  onGenreChange = () => {},
  selectedYear = '',
  onYearChange = () => {},
  availableYears = [],
  sortBy = 'default',
  onSortChange = () => {},
  onClearFilters = () => {},
  hasActiveFilters = false,
  resultsCount = 0,
}) {
  return (
    <div className="filter-bar-card card-glass">
      <div className="filter-grid">
        {/* Genre Selector */}
        <div>
          <label className="filter-label">
            <Film size={14} /> Genre
          </label>
          <select
            className="form-select"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id || g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Release Year Selector */}
        <div>
          <label className="filter-label">
            <Calendar size={14} /> Release Year
          </label>
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label className="filter-label">
            <SlidersHorizontal size={14} /> Sort By
          </label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="default">Default Order</option>
            <option value="rating-desc">Rating: Highest First</option>
            <option value="rating-asc">Rating: Lowest First</option>
            <option value="year-desc">Year: Newest First</option>
            <option value="year-asc">Year: Oldest First</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div>
          <label className="filter-label" style={{ visibility: 'hidden' }}>
            Action
          </label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            style={{
              opacity: hasActiveFilters ? 1 : 0.5,
              cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
              width: '100%',
            }}
            title="Clear all filters"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </div>

      {/* Active filters summary */}
      <div className="filter-active-chips">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Showing <strong>{resultsCount}</strong> {resultsCount === 1 ? 'movie' : 'movies'}
        </span>

        {selectedGenre && (
          <span className="filter-chip">
            Genre: {selectedGenre}
            <span
              className="filter-chip-remove"
              onClick={() => onGenreChange('')}
              role="button"
              tabIndex={0}
            >
              ×
            </span>
          </span>
        )}

        {selectedYear && (
          <span className="filter-chip">
            Year: {selectedYear}
            <span
              className="filter-chip-remove"
              onClick={() => onYearChange('')}
              role="button"
              tabIndex={0}
            >
              ×
            </span>
          </span>
        )}

        {sortBy !== 'default' && (
          <span className="filter-chip">
            Sorted
            <span
              className="filter-chip-remove"
              onClick={() => onSortChange('default')}
              role="button"
              tabIndex={0}
            >
              ×
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

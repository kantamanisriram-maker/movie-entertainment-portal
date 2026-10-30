import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange = () => {},
  placeholder = 'Search movies by title, cast, or director...',
  onClear = null,
  className = '',
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`search-bar-wrap ${className}`}>
      <Search size={20} className="search-icon-left" />
      <input
        type="text"
        className="search-input-box"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label="Search movies"
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
          title="Clear search"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

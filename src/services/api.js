/**
 * API Service Layer for Movie & Entertainment Management Portal
 * Author: Shanmukhasriram Kantamani
 * Date: 19 October 2026
 * 
 * Centralized service layer handling all HTTP interactions with JSON Server.
 * All React components communicate with JSON Server exclusively through this service.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Helper function for unified fetch requests with error handling
 * and proper JSON parsing
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Check if HTTP response status is successful (200-299)
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[API Warning] Request to ${endpoint} returned status ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText || 'Request failed'}`);
    }

    // For DELETE operations, response might be empty or 204
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[API Error] Failed to fetch from ${endpoint}:`, error.message);
    throw error;
  }
}

/* ==========================================================================
   MOVIES API
   ========================================================================== */

/**
 * Fetch all movies from JSON Server
 * Supports optional query params (e.g., _sort, _order, q)
 */
export async function getMovies(queryParams = '') {
  const query = queryParams ? `?${queryParams}` : '';
  return await request(`/movies${query}`);
}

/**
 * Fetch a single movie by its ID
 */
export async function getMovieById(id) {
  if (!id) throw new Error('Movie ID is required');
  return await request(`/movies/${id}`);
}

/**
 * Add a new movie record to the database
 */
export async function addMovie(movie) {
  return await request('/movies', {
    method: 'POST',
    body: JSON.stringify(movie),
  });
}

/**
 * Update an existing movie by ID
 */
export async function updateMovie(id, movie) {
  if (!id) throw new Error('Movie ID is required for update');
  return await request(`/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movie),
  });
}

/**
 * Delete a movie record by ID
 */
export async function deleteMovie(id) {
  if (!id) throw new Error('Movie ID is required for deletion');
  return await request(`/movies/${id}`, {
    method: 'DELETE',
  });
}

/* ==========================================================================
   GENRES API
   ========================================================================== */

/**
 * Fetch all movie genres
 */
export async function getGenres() {
  return await request('/genres');
}

/**
 * Add a new genre
 */
export async function addGenre(genre) {
  return await request('/genres', {
    method: 'POST',
    body: JSON.stringify(genre),
  });
}

/**
 * Update an existing genre
 */
export async function updateGenre(id, genre) {
  if (!id) throw new Error('Genre ID is required for update');
  return await request(`/genres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(genre),
  });
}

/**
 * Delete a genre by ID
 */
export async function deleteGenre(id) {
  if (!id) throw new Error('Genre ID is required for deletion');
  return await request(`/genres/${id}`, {
    method: 'DELETE',
  });
}

/* ==========================================================================
   REVIEWS API
   ========================================================================== */

/**
 * Fetch all reviews or reviews filtered by movie
 */
export async function getReviews(queryParams = '') {
  const query = queryParams ? `?${queryParams}` : '';
  return await request(`/reviews${query}`);
}

/**
 * Fetch a single review by ID
 */
export async function getReviewById(id) {
  if (!id) throw new Error('Review ID is required');
  return await request(`/reviews/${id}`);
}

/**
 * Add a new review
 */
export async function addReview(review) {
  return await request('/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  });
}

/**
 * Update an existing review
 */
export async function updateReview(id, review) {
  if (!id) throw new Error('Review ID is required for update');
  return await request(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(review),
  });
}

/**
 * Delete a review by ID
 */
export async function deleteReview(id) {
  if (!id) throw new Error('Review ID is required for deletion');
  return await request(`/reviews/${id}`, {
    method: 'DELETE',
  });
}

# Movie & Entertainment Management Portal (CineVerse)

**Capstone Project 2026**  
**Author:** Shanmukhasriram Kantamani (Shanmukhasri Kantamani)  
**Email:** [shanmukhasri.kantamani24@sasi.ac.in](mailto:shanmukhasri.kantamani24@sasi.ac.in)  
**Project Date:** 19 October 2026  
**Copyright:** Copyright © 2026 Shanmukhasri Kantamani. All rights reserved.  

---

## 🎬 Project Overview

**CineVerse** is a modern, responsive, and fully functional **Movie & Entertainment Management Portal** built using **React.js** and **JSON Server**. Designed with a dark cinematic theme inspired by premier streaming platforms, CineVerse bridges audience entertainment exploration with comprehensive administrative inventory control.

The system features two interconnected spaces:
1. **User Panel:** Browse featured blockbusters, search movies by keywords, filter by dynamic genres and release years, watch trailers, and submit 5-star ratings and reviews.
2. **Admin Panel:** Complete CRUD (Create, Read, Update, Delete) management for both movies and genres, real-time analytics dashboard with dynamic calculations, and review moderation.

All application data is dynamically retrieved from and persisted to a **JSON Server** REST API backed by `db.json`.

---

## 🚀 Key Technologies & Stack

### Frontend
- **React.js 18:** Functional components, Controlled Forms, Custom Hooks.
- **React Router DOM v6:** Client-side SPA navigation without full-page reloads.
- **JavaScript (ES6+):** Async/Await, Destructuring, Array transformations (`map`, `filter`, `reduce`).
- **HTML5 & CSS3:** Custom cinematic theme, CSS Variables, Flexbox/Grid, Glassmorphism, Keyframe animations.
- **Lucide Icons:** Scalable vector iconography for modern UI indicators.
- **Vite:** High-performance frontend build tool and development server.

### Backend & API
- **JSON Server:** Full REST API mock server running on `http://localhost:3000`.
- **Database:** `db.json` containing `movies`, `genres`, and `reviews` collections.
- **API Service Layer:** `src/services/api.js` organizing all asynchronous Fetch API requests.

---

## 🛠️ Project Structure

```text
├── db.json                     # JSON Server Database file
├── index.html                  # HTML entry point with Google Fonts
├── package.json                # Dependencies and dev scripts
├── vite.config.js              # Vite server configuration
├── README.md                   # Documentation and execution guide
└── src/
    ├── App.jsx                 # App component with route definitions
    ├── main.jsx                # React root bootstrap
    ├── components/
    │   ├── ConfirmModal.jsx    # Delete confirmation dialog
    │   ├── Footer.jsx          # Copyright and author footer
    │   ├── Modal.jsx           # Reusable backdrop modal
    │   ├── MovieCard.jsx       # Interactive movie display card
    │   ├── MovieFilter.jsx     # Genre, year, and sorting controls
    │   ├── Navbar.jsx          # Glassmorphic top navigation bar
    │   ├── RatingStars.jsx     # 5-Star interactive & display stars
    │   ├── ReviewCard.jsx      # Audience review card with avatars
    │   └── SearchBar.jsx       # Debounced search bar with clear action
    ├── pages/
    │   ├── About.jsx           # Student info, project specs & flow
    │   ├── AdminDashboard.jsx  # Analytics metrics & genre bar chart
    │   ├── Home.jsx            # Spotlight hero, stats ribbon & shelves
    │   ├── ManageGenres.jsx    # Genre CRUD & movie count per genre
    │   ├── ManageMovies.jsx    # Movie CRUD with form validation
    │   ├── MovieDetails.jsx    # Movie backdrop, trailer & reviews
    │   ├── Movies.jsx          # Full movie catalogue with filters
    │   └── Reviews.jsx         # Review moderation & listing
    ├── services/
    │   └── api.js              # Centralized Fetch API service layer
    └── styles/
        ├── Admin.css           # Table views, modals, and management
        ├── Dashboard.css       # Charts, metrics, and showcases
        ├── global.css          # Design tokens, variables & typography
        ├── Home.css            # Hero animations and shelf grids
        ├── Movies.css          # Poster cards, video frames & reviews
        └── Navbar.css          # Glassmorphism header and drawer
```

---

## 📡 REST API Specifications

The portal interacts with JSON Server on `http://localhost:3000`:

| Resource | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Movies** | `GET` | `/movies` | Retrieve all movies |
| | `GET` | `/movies/:id` | Retrieve single movie by ID |
| | `POST` | `/movies` | Create a new movie |
| | `PUT` | `/movies/:id` | Update an existing movie |
| | `DELETE` | `/movies/:id` | Delete a movie from database |
| **Genres** | `GET` | `/genres` | Retrieve all film categories |
| | `POST` | `/genres` | Create a new genre |
| | `PUT` | `/genres/:id` | Edit an existing genre |
| | `DELETE` | `/genres/:id` | Delete a genre |
| **Reviews** | `GET` | `/reviews` | Retrieve all reviews (or `?movieId=X`) |
| | `POST` | `/reviews` | Submit new user rating & review |
| | `PUT` | `/reviews/:id` | Update review comment or rating |
| | `DELETE` | `/reviews/:id` | Delete review |

---

## ⚙️ Installation & Running the Project

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Step 1: Install Dependencies
Open a terminal in the project root directory and run:
```bash
npm install
```

### Step 2: Start JSON Server (Port 3000)
In a terminal window, start the backend database API:
```bash
npm run server
```
*JSON Server will serve endpoints on `http://localhost:3000` watching `db.json`.*

### Step 3: Start React Development Server (Port 5173)
In a second terminal window, run the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:5173
```

---

## 🌟 Tested User & Admin Workflows

1. **Browse Movies & Filter:**
   - Navigate to `/movies`.
   - Search by keyword (e.g., "Nolan", "Sci-Fi", "Spider").
   - Filter by Genre dropdown or Release Year.
   - Sort by Rating (Highest/Lowest) or Year.
2. **View Movie Details & Watch Trailer:**
   - Click "View Details" or any poster to open `/movies/:id`.
   - Watch the embedded trailer or click "Watch Official Trailer" to open the video modal.
3. **Submit Ratings & Reviews:**
   - Under the movie details page, submit your name, choose a 5-star rating, and submit a review.
   - The UI automatically updates and recalculates the average rating immediately.
4. **Admin Movie Management (CRUD):**
   - Navigate to `/admin/movies`.
   - Click **Add New Movie** → Fill title, director, year, genre, and paste a poster URL to view the live preview.
   - Edit any movie by clicking the edit icon.
   - Delete any movie with safety confirmation modal.
5. **Genre Management:**
   - Navigate to `/admin/genres`.
   - View dynamically calculated movie counts for each genre.
   - Add new genres, edit existing ones, or delete unused genres.
6. **Executive Dashboard:**
   - Navigate to `/dashboard`.
   - Inspect total movies, average rating across all reviews, highest-rated film showcase, and the interactive **Movies by Genre Bar Chart**.

---

## 📄 License & Attribution

Designed and developed by **Shanmukhasriram Kantamani**  
Email: [shanmukhasri.kantamani24@sasi.ac.in](mailto:shanmukhasri.kantamani24@sasi.ac.in)  
GitHub Repository: [https://github.com/kantamanisriram-maker/movie-entertainment-portal](https://github.com/kantamanisriram-maker/movie-entertainment-portal)  
Date: **19 October 2026**  
Copyright © 2026 Shanmukhasri Kantamani. All rights reserved.

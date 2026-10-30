import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Film, Clapperboard, LayoutDashboard, Sliders, MessageSquare, Info, Menu, X, Layers } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <div className="brand-icon-wrap">
            <Film size={20} />
          </div>
          <div className="brand-title">
            <span className="brand-main">CINEVERSE</span>
            <span className="brand-sub">ENTERTAINMENT PORTAL</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/movies" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <Clapperboard size={15} />
              Movies
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/genres" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <Layers size={15} />
              Genres
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={15} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/movies" className={({ isActive }) => `nav-item-link admin-pill ${isActive ? 'active' : ''}`}>
              <Sliders size={15} />
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink to="/reviews" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <MessageSquare size={15} />
              Reviews
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <Info size={15} />
              About
            </NavLink>
          </li>
        </ul>

        {/* Mobile Hamburger Toggle */}
        <div className="nav-actions">
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <Clapperboard size={16} />
            Movies
          </NavLink>
          <NavLink to="/admin/genres" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <Layers size={16} />
            Genres
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/movies" className={({ isActive }) => `nav-item-link admin-pill ${isActive ? 'active' : ''}`}>
            <Sliders size={16} />
            Admin Panel
          </NavLink>
          <NavLink to="/reviews" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <MessageSquare size={16} />
            Reviews
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <Info size={16} />
            About Project
          </NavLink>
        </div>
      )}
    </nav>
  );
}

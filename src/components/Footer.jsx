import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Mail, Calendar, Heart, Shield, Code, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Mission */}
          <div className="footer-brand-col">
            <Link to="/" className="nav-brand" style={{ marginBottom: '0.5rem' }}>
              <div className="brand-icon-wrap">
                <Film size={20} />
              </div>
              <div className="brand-title">
                <span className="brand-main">CINEVERSE</span>
                <span className="brand-sub">ENTERTAINMENT PORTAL</span>
              </div>
            </Link>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Next-generation Movie & Entertainment Management Portal built with React.js and JSON Server.
              Browse premier movies, submit reviews, and manage comprehensive cinematic catalogues.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="badge badge-purple">
                <Code size={12} /> React 18
              </span>
              <span className="badge badge-red">
                <Sparkles size={12} /> JSON Server API
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/movies" className="footer-link">Movie Catalogue</Link></li>
              <li><Link to="/admin/genres" className="footer-link">Genres</Link></li>
              <li><Link to="/reviews" className="footer-link">Audience Reviews</Link></li>
              <li><Link to="/about" className="footer-link">About Project</Link></li>
            </ul>
          </div>

          {/* Admin Panel Links */}
          <div>
            <h4 className="footer-col-title">Management</h4>
            <ul className="footer-links-list">
              <li><Link to="/dashboard" className="footer-link">Analytics Dashboard</Link></li>
              <li><Link to="/admin/movies" className="footer-link">Manage Movies (CRUD)</Link></li>
              <li><Link to="/admin/genres" className="footer-link">Manage Genres (CRUD)</Link></li>
              <li><Link to="/reviews" className="footer-link">Moderate Reviews</Link></li>
            </ul>
          </div>

          {/* Project Details & Author Info */}
          <div>
            <h4 className="footer-col-title">Project Details</h4>
            <ul className="footer-links-list">
              <li style={{ color: '#fff', fontWeight: 600 }}>
                Shanmukhasriram Kantamani
              </li>
              <li>
                <a
                  href="mailto:shanmukhasri.kantamani24@sasi.ac.in"
                  className="footer-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Mail size={14} />
                  shanmukhasri.kantamani24@sasi.ac.in
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                Date: 19 October 2026
              </li>
              <li style={{ marginTop: '0.5rem' }}>
                <span className="badge badge-gold">
                  Capstone Project 2026
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            Copyright © 2026 Shanmukhasriram Kantamani (Shanmukhasri Kantamani). All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} fill="var(--accent-red)" color="var(--accent-red)" />
            <span>using React.js & JSON Server REST API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

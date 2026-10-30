import React from 'react';
import {
  Film,
  Mail,
  Calendar,
  User,
  Shield,
  Code,
  Server,
  Layers,
  Database,
  CheckCircle,
  ExternalLink,
  Sparkles,
  BookOpen
} from 'lucide-react';
import '../styles/Admin.css';

export default function About() {
  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <div className="about-hero">
        <span className="section-tag">Academic Capstone Showcase</span>
        <h1 className="section-title" style={{ fontSize: '2.8rem' }}>
          Movie & Entertainment Management Portal
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          A modern, full-stack React.js and JSON Server web application engineered for browsing, reviewing,
          and managing cinema entertainment catalogues with real-time REST API integration.
        </p>
      </div>

      {/* Author & Project Details Card */}
      <div className="card-glass" style={{ padding: '2.5rem', marginBottom: '3rem', border: '1px solid rgba(139, 92, 246, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="author-profile-box">
            <div className="author-avatar-large">SK</div>
            <div className="author-details">
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                Lead Developer & Designer
              </span>
              <h2 className="author-name" style={{ fontSize: '1.6rem' }}>Shanmukhasriram Kantamani</h2>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                <a
                  href="mailto:shanmukhasri.kantamani24@sasi.ac.in"
                  className="author-meta-item"
                  style={{ color: 'var(--accent-purple)' }}
                >
                  <Mail size={16} /> shanmukhasri.kantamani24@sasi.ac.in
                </a>
                <span className="author-meta-item">
                  <Calendar size={16} /> 19 October 2026
                </span>
                <span className="author-meta-item">
                  <Shield size={16} /> Copyright © 2026 Shanmukhasri Kantamani
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-red">React 18 Capstone</span>
            <span className="badge badge-gold">JSON Server REST</span>
          </div>
        </div>
      </div>

      {/* Technical Architecture & Concepts */}
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-tag">Engineering Specifications</span>
          <h2 className="section-title">Implemented React & REST Concepts</h2>
        </div>
      </div>

      <div className="about-cards-grid">
        {/* Card 1: Core Technologies */}
        <div className="about-card card-glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon-wrap stat-icon-purple" style={{ width: '44px', height: '44px' }}>
              <Code size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Frontend Technology Stack</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-purple)" />
              <span><strong>React 18 & Vite:</strong> Lightning-fast SPA rendering</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-purple)" />
              <span><strong>React Router DOM v6:</strong> Declarative client-side routing</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-purple)" />
              <span><strong>Hooks Architecture:</strong> useState, useEffect, useMemo, useParams</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-purple)" />
              <span><strong>Vanilla CSS3:</strong> Custom dark cinematic design system</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Backend Architecture */}
        <div className="about-card card-glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon-wrap stat-icon-red" style={{ width: '44px', height: '44px' }}>
              <Server size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Backend & REST API Flow</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-red)" />
              <span><strong>JSON Server on Port 3000:</strong> RESTful API server</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-red)" />
              <span><strong>Live db.json Database:</strong> Movies, Genres, Reviews</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-red)" />
              <span><strong>Dedicated Service Layer:</strong> <code>src/services/api.js</code></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-red)" />
              <span><strong>HTTP Methods:</strong> GET, POST, PUT, DELETE with error handling</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Key Features & Validation */}
        <div className="about-card card-glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon-wrap stat-icon-gold" style={{ width: '44px', height: '44px' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Platform Capabilities</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-gold)" />
              <span><strong>Dynamic Dashboard:</strong> Charts and statistics from API data</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-gold)" />
              <span><strong>5-Star Review System:</strong> Dynamic average recalculation</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-gold)" />
              <span><strong>Multi-Criteria Search:</strong> Genre, release year, keywords</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} color="var(--accent-gold)" />
              <span><strong>Form Validation:</strong> Real-time field checks and feedback</span>
            </li>
          </ul>
        </div>
      </div>

      {/* API Flowchart Diagram */}
      <div className="card-glass" style={{ padding: '2.5rem' }}>
        <h3 style={{ color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="var(--accent-cyan)" /> Capstone CRUD Workflow Diagram
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>1. READ Flow</h4>
            <p style={{ fontSize: '0.88rem' }}>
              User opens page → React Component → useEffect() → api.js request → Fetch API → JSON Server → db.json → Response → setState() → UI re-renders.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--accent-red)', marginBottom: '0.5rem' }}>2. CREATE Flow</h4>
            <p style={{ fontSize: '0.88rem' }}>
              Add Form → Controlled useState → Form Validation → POST API payload → JSON Server writes db.json → Success Banner → Refresh State.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>3. UPDATE Flow</h4>
            <p style={{ fontSize: '0.88rem' }}>
              Edit Action → GET /movies/:id → Populate Form Modal → User Modifies → PUT API → db.json updated → Instant UI state reflection.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>4. DELETE Flow</h4>
            <p style={{ fontSize: '0.88rem' }}>
              Delete Button → Confirmation Dialog → DELETE API request → JSON Server removes entry from db.json → UI list filters out item.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

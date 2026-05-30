import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { compareList } = useAppContext();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Colleges' },
    { to: '/compare', label: 'Compare', badge: compareList.length || null },
    { to: '/predictor', label: 'Predictor' },
    { to: '/best-fit', label: 'Best Fit ✨' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <span style={{ fontSize: '24px' }}>🎓</span>
          <span className="navbar-logo-text">
            Campus<span style={{ color: 'var(--color-accent)' }}>Lens</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              id={`nav-${link.label.toLowerCase()}`}
              end={link.to === '/'}
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              {link.label}
              {link.badge && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    marginLeft: '4px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'white',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}

        {/* Auth Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="btn btn-secondary text-sm py-1.5 px-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="btn btn-primary text-sm py-1.5 px-3"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          id="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: 'var(--radius-md)',
          }}
          aria-label="Toggle menu"
        >
          <span
            style={{
              width: '20px',
              height: '2px',
              backgroundColor: 'var(--color-text-primary)',
              borderRadius: '999px',
              transition: 'all 0.3s ease',
              transform: mobileOpen ? 'rotate(45deg) translateY(3px)' : 'none',
            }}
          />
          <span
            style={{
              width: '20px',
              height: '2px',
              backgroundColor: 'var(--color-text-primary)',
              borderRadius: '999px',
              marginTop: '4px',
              marginBottom: '4px',
              transition: 'all 0.3s ease',
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              width: '20px',
              height: '2px',
              backgroundColor: 'var(--color-text-primary)',
              borderRadius: '999px',
              transition: 'all 0.3s ease',
              transform: mobileOpen ? 'rotate(-45deg) translateY(-3px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav
          style={{
            padding: 'var(--spacing-lg)',
            borderTop: '0.5px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
          className="animate-slide-down"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              style={{
                padding: 'var(--spacing-md) 0',
                borderBottom: '0.5px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {link.label}
                {link.badge && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'var(--color-accent)',
                      color: 'white',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>
            🎓 Campus<span style={{ color: 'var(--color-accent)' }}>Lens</span>
          </h3>
          <p>
            Your comprehensive search and decision platform for higher education in India. Compare colleges, predict admissions, and find your best-fit future.
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social-icon" aria-label="Twitter">🐦</a>
            <a href="#" className="footer-social-icon" aria-label="LinkedIn">🔗</a>
            <a href="#" className="footer-social-icon" aria-label="Instagram">📸</a>
            <a href="#" className="footer-social-icon" aria-label="GitHub">💻</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Features</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Colleges Database</Link></li>
            <li><Link to="/compare" className="footer-link">Compare Colleges</Link></li>
            <li><Link to="/predictor" className="footer-link">Admissions Predictor</Link></li>
            <li><Link to="/best-fit" className="footer-link">AI Advisor ✨</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Popular Exams</h4>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">JEE Main</a></li>
            <li><a href="#" className="footer-link">JEE Advanced</a></li>
            <li><a href="#" className="footer-link">BITSAT</a></li>
            <li><a href="#" className="footer-link">CAT Exam</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">NIRF Rankings</a></li>
            <li><a href="#" className="footer-link">Placement Reports</a></li>
            <li><a href="#" className="footer-link">Student Reviews</a></li>
            <li><a href="#" className="footer-link">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CampusLens. All rights reserved.</p>
        <p>Made with ❤️ for Indian Students</p>
      </div>
    </footer>
  );
}

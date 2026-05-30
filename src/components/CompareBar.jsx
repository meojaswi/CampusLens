import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useAppContext();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{animation: 'slideUp 0.3s ease'}}>
      <div style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', borderTop: '0.5px solid var(--color-border)', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto', padding: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-lg)'}}>
          {/* College Chips */}
          <div style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flex: 1, minWidth: 0, overflowX: 'auto'}}>
            <span style={{fontSize: '14px', fontWeight: '500', color: 'var(--color-text-secondary)', flexShrink: 0}}>
              Compare ({compareList.length}/3):
            </span>
            {compareList.map((college) => (
              <span
                key={college.id}
                className="compare-ring"
                style={{display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'rgba(26, 115, 232, 0.1)', color: 'var(--color-accent)', fontSize: '14px', fontWeight: '500', borderRadius: 'var(--radius-pill)', flexShrink: 0, border: '0.5px solid var(--color-accent)'}}
              >
                {college.name}
                <button
                  onClick={() => removeFromCompare(college.id)}
                  style={{width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(26, 115, 232, 0.2)', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: 'var(--color-accent)', transition: 'all 0.2s ease'}}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(26, 115, 232, 0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(26, 115, 232, 0.2)'}
                  aria-label={`Remove ${college.name}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Actions */}
          <div style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexShrink: 0}}>
            <button
              id="compare-clear-all"
              onClick={clearCompare}
              style={{fontSize: '14px', fontWeight: '500', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s ease'}}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
            >
              Clear All
            </button>
            <button
              id="compare-now-btn"
              onClick={() => navigate('/compare')}
              disabled={compareList.length < 2}
              className="btn-primary"
              style={{fontSize: '14px'}}
            >
              Compare Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

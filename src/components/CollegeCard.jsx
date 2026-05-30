import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { useAppContext } from '../context/AppContext';

const typeColors = {
  Government: '#3b82f6',
  Private: '#8b5cf6',
  Deemed: '#a78bfa',
};

function formatFees(amount) {
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1).replace(/\.0$/, '')} L`;
  }
  return `${(amount / 1000).toFixed(0)}K`;
}

export default function CollegeCard({ college }) {
  const { addToCompare, removeFromCompare, isComparing, compareList, maxCompare } = useAppContext();
  const comparing = isComparing(college.id);
  const canAdd = compareList.length < maxCompare;

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (comparing) {
      removeFromCompare(college.id);
    } else if (canAdd) {
      addToCompare(college);
    }
  };

  return (
    <>
      <div
        className={`card card-interactive animate-fade-in-up transition-all duration-300 ${
          comparing ? 'compare-ring' : ''
        }`}
        id={`college-card-${college.id}`}
        style={{ borderColor: comparing ? 'var(--color-success)' : undefined }}
      >
        {/* Main Card Content - 3 zones layout */}
        <div className="card-full-width">
          {/* Zone 1: Logo/Icon (left) */}
          <div
            className="card-logo"
            style={{
              backgroundColor: typeColors[college.type],
              opacity: 0.9,
            }}
          >
            {college.logo}
          </div>

          {/* Zone 2: Main Info (center) */}
          <div className="card-main">
            <h3 className="card-title">
              {college.name}
            </h3>
            <p className="card-subtitle">
              📍 {college.city}, {college.state}
            </p>

            {/* Meta Info Grid */}
            <div className="card-meta">
              <div className="card-meta-item">
                <strong>Annual Fees</strong>
                <div className="card-meta-value">
                  ₹{formatFees(college.feesMin)} – ₹{formatFees(college.feesMax)}/yr
                </div>
              </div>
              <div className="card-meta-item">
                <strong>Rankings</strong>
                <div className="card-meta-value" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {college.nirfRank && (
                    <span className="badge badge-amber">NIRF #{college.nirfRank}</span>
                  )}
                  {college.naac && (
                    <span className="badge" style={{
                      background: college.naac === 'A++' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                      color: college.naac === 'A++' ? 'var(--color-success)' : 'var(--color-text-secondary)',
                    }}>
                      {college.naac}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Zone 3: Rating & Actions (right) */}
          <div className="card-actions">
            <div className="card-rating">
              <div className="card-rating-stars">
                <RatingStars rating={college.rating} size="sm" />
              </div>
              <div className="card-rating-value">{college.rating}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <Link
                to={`/college/${college.id}`}
                id={`view-details-${college.id}`}
                className="btn btn-primary"
                style={{ minWidth: '120px', textAlign: 'center', padding: 'var(--spacing-md) var(--spacing-lg)', fontSize: '13px' }}
              >
                Details
              </Link>

              <button
                id={`compare-toggle-${college.id}`}
                onClick={handleCompareToggle}
                disabled={!comparing && !canAdd}
                className={`btn ${comparing ? 'btn-success' : canAdd ? 'btn-secondary' : 'btn-disabled'}`}
                style={{ minWidth: '120px', padding: 'var(--spacing-md) var(--spacing-lg)', fontSize: '13px' }}
                title={!comparing && !canAdd ? 'Max 3 colleges for comparison' : ''}
              >
                {comparing ? '✓ Added' : 'Compare'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer: Type badge + Recruiters */}
        <div className="card-footer">
          <div className="card-type-badge">
            {college.type}
          </div>
          {college.placements?.recruiters && (
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              🏢 {college.placements.recruiters.slice(0, 2).join(', ')}
              {college.placements.recruiters.length > 2 && ' +more'}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

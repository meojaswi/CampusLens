import { colleges } from '../data/mockColleges';

const allStates = [...new Set(colleges.map((c) => c.state))].sort();
const typeOptions = ['All', 'Government', 'Private', 'Deemed'];
const sortOptions = [
  { value: 'rating', label: 'Rating (High → Low)' },
  { value: 'fees-low', label: 'Fees (Low → High)' },
  { value: 'fees-high', label: 'Fees (High → Low)' },
  { value: 'nirf', label: 'NIRF Rank' },
];

export default function FilterPanel({ filters, onChange }) {
  const handleTypeChange = (type) => {
    onChange({ ...filters, type, page: 1 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* College Type Filter */}
      <div className="filter-section">
        <div className="filter-section-label">College Type</div>
        <div className="filter-chips">
          {typeOptions.map((type) => (
            <button
              key={type}
              id={`filter-type-${type.toLowerCase()}`}
              onClick={() => handleTypeChange(type)}
              className={`filter-chip ${filters.type === type ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="filter-section">
        <div className="filter-section-label">Location</div>
        <select
          id="filter-state"
          value={filters.state}
          onChange={(e) => onChange({ ...filters, state: e.target.value, page: 1 })}
          className="select"
        >
          <option value="">All States</option>
          {allStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="filter-section">
        <div className="filter-section-label">Sort By</div>
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value, page: 1 })}
          className="select"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

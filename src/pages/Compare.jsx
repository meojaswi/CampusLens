import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { colleges as allColleges } from '../data/mockColleges';
import RatingStars from '../components/RatingStars';

const logoColors = {
  Government: 'bg-blue-600',
  Private: 'bg-purple-600',
  Deemed: 'bg-violet-600',
};

function formatFees(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} L`;
  return `₹${(amount / 1000).toFixed(0)}K`;
}

const metrics = [
  {
    key: 'rating',
    label: 'Rating',
    getValue: (c) => c.rating,
    render: (c) => <RatingStars rating={c.rating} size="sm" />,
    higherBetter: true,
  },
  {
    key: 'location',
    label: 'Location',
    getValue: (c) => `${c.city}, ${c.state}`,
    render: (c) => <span className="text-sm">{c.city}, {c.state}</span>,
    higherBetter: null,
  },
  {
    key: 'type',
    label: 'Type',
    getValue: (c) => c.type,
    render: (c) => {
      const colors = { Government: 'badge-blue', Private: 'badge-purple', Deemed: 'badge-purple' };
      return <span className={`badge ${colors[c.type] || 'badge-gray'}`}>{c.type}</span>;
    },
    higherBetter: null,
  },
  {
    key: 'fees',
    label: 'Fee Range',
    getValue: (c) => c.feesMin,
    render: (c) => <span className="text-sm font-semibold">{formatFees(c.feesMin)} – {formatFees(c.feesMax)}</span>,
    higherBetter: false,
  },
  {
    key: 'avgPackage',
    label: 'Avg Package',
    getValue: (c) => c.placements.avg,
    render: (c) => <span className="text-sm font-semibold">{c.placements.avg} LPA</span>,
    higherBetter: true,
  },
  {
    key: 'highestPackage',
    label: 'Highest Package',
    getValue: (c) => c.placements.highest,
    render: (c) => <span className="text-sm font-semibold">{c.placements.highest} LPA</span>,
    higherBetter: true,
  },
  {
    key: 'placementPercent',
    label: 'Placement %',
    getValue: (c) => c.placements.percent,
    render: (c) => <span className="text-sm font-semibold">{c.placements.percent}%</span>,
    higherBetter: true,
  },
  {
    key: 'nirf',
    label: 'NIRF Rank',
    getValue: (c) => c.nirfRank,
    render: (c) => <span className="text-sm font-bold">#{c.nirfRank}</span>,
    higherBetter: false,
  },
  {
    key: 'naac',
    label: 'NAAC Grade',
    getValue: (c) => c.naac,
    render: (c) => {
      return <span className={`badge ${c.naac === 'A++' ? 'badge-green' : 'badge-gray'}`}>{c.naac}</span>;
    },
    higherBetter: null,
  },
  {
    key: 'recruiters',
    label: 'Top Recruiters',
    getValue: (c) => c.placements.recruiters.join(', '),
    render: (c) => (
      <span className="text-xs text-muted">{c.placements.recruiters.slice(0, 3).join(', ')}</span>
    ),
    higherBetter: null,
  },
];

function getCellColor(metric, college, colleges) {
  if (metric.higherBetter === null || colleges.length < 2) return '';
  const values = colleges.map((c) => metric.getValue(c));
  const val = metric.getValue(college);
  const best = metric.higherBetter ? Math.max(...values) : Math.min(...values);
  const worst = metric.higherBetter ? Math.min(...values) : Math.max(...values);

  if (values.filter((v) => v === val).length === values.length) return '';
  if (val === best) return 'bg-emerald-600 text-white';
  if (val === worst) return 'bg-red-600 text-white';
  return '';
}

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const available = allColleges.filter(
    (c) => !compareList.some((cc) => cc.id === c.id)
  );
  const filtered = searchQuery
    ? available.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleAdd = (college) => {
    addToCompare(college);
    setSearchQuery('');
  };

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in max-w-md px-4">
          <p className="text-6xl mb-4">⚖️</p>
          <h2 className="text-2xl font-bold text-on-surface">No Colleges to Compare</h2>
          <p className="text-muted mt-2">Add at least 2 colleges from the listing page to compare them side by side.</p>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            ← Browse Colleges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Compare Colleges</h1>
            <p className="text-muted mt-1">Side-by-side comparison of your selected colleges</p>
          </div>
          <button
            id="compare-page-clear"
            onClick={clearCompare}
            className="text-sm font-medium text-danger hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Comparison Table */}
        <div className="card overflow-hidden animate-fade-in-up stagger-1">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              {/* College Headers */}
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 bg-slate-900 w-40 p-4 text-left text-sm font-semibold text-muted border-r border-border">
                    Metric
                  </th>
                  {compareList.map((college) => {
                    const lc = logoColors[college.type] || logoColors.Deemed;
                    return (
                      <th key={college.id} className="p-4 text-center min-w-[200px]">
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-14 h-14 ${lc} rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                            {college.logo}
                          </div>
                          <Link
                            to={`/college/${college.id}`}
                            className="text-sm font-semibold text-on-surface hover:text-primary transition-colors"
                          >
                            {college.name}
                          </Link>
                          <button
                            onClick={() => removeFromCompare(college.id)}
                            className="text-xs text-muted hover:text-danger transition-colors"
                          >
                            Remove ✕
                          </button>
                        </div>
                      </th>
                    );
                  })}
                  {/* Add Column */}
                  {compareList.length < 3 && (
                    <th className="p-4 text-center min-w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-2xl text-muted">
                          +
                        </div>
                        <div className="relative w-full max-w-[180px]">
                          <input
                            id="compare-add-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Add college..."
                            className="input text-sm text-center"
                          />
                          {searchQuery && filtered.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 card py-1 max-h-40 overflow-y-auto z-20 shadow-lg">
                              {filtered.map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => handleAdd(c)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-primary-light transition-colors truncate"
                                >
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          )}
                          {searchQuery && filtered.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 card py-3 px-3 text-xs text-muted text-center shadow-lg z-20">
                              No matches
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              {/* Metric Rows */}
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.key} className="border-b border-border last:border-0 hover:bg-slate-800/50 transition-colors">
                    <td className="sticky left-0 z-10 bg-slate-900 p-4 text-sm font-medium text-muted border-r border-border">
                      {metric.label}
                    </td>
                    {compareList.map((college) => (
                      <td
                        key={college.id}
                        className={`p-4 text-center ${getCellColor(metric, college, compareList)} transition-colors`}
                      >
                        {metric.render(college)}
                      </td>
                    ))}
                    {compareList.length < 3 && <td className="p-4" />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex items-center gap-6 mt-4 text-xs text-muted animate-fade-in stagger-2">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-700" /> Best value
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-600 border border-red-700" /> Lowest value
          </span>
        </div>
      </div>
    </div>
  );
}

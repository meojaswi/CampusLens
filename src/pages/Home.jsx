import { useState, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { colleges as allColleges } from '../data/mockColleges';
import CollegeCard from '../components/CollegeCard';
import FilterPanel from '../components/FilterPanel';
import CompareBar from '../components/CompareBar';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'All',
    state: '',
    sort: 'rating',
    page: 1,
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredColleges = useMemo(() => {
    let result = [...allColleges];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filters.type && filters.type !== 'All') {
      result = result.filter((c) => c.type === filters.type);
    }

    // State filter
    if (filters.state) {
      result = result.filter((c) => c.state === filters.state);
    }

    // Sort
    switch (filters.sort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'fees-low':
        result.sort((a, b) => a.feesMin - b.feesMin);
        break;
      case 'fees-high':
        result.sort((a, b) => b.feesMax - a.feesMax);
        break;
      case 'nirf':
        result.sort((a, b) => (a.nirfRank || 999) - (b.nirfRank || 999));
        break;
    }

    return result;
  }, [debouncedSearch, filters]);

  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(filters.page, totalPages || 1);
  const paginatedColleges = filteredColleges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <section className="hero animate-fade-in">
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in-up">
            Find Your Perfect College
          </h1>
          <p className="hero-subtitle animate-fade-in-up stagger-1">
            Explore, compare, and decide with clarity. India's smartest college discovery platform.
          </p>

          {/* Search Bar */}
          <div className="hero-search animate-fade-in-up stagger-2">
            <input
              id="hero-search"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFilters((f) => ({ ...f, page: 1 }));
              }}
              placeholder="Search colleges by name, city, or state..."
              className="hero-search-input"
            />
          </div>

          {/* Quick Stats */}
          <div className="hero-stats animate-fade-in-up stagger-3">
            <div className="hero-stat">
              <div className="hero-stat-value">{allColleges.length}+</div>
              <div className="hero-stat-label">Top Colleges</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">50+</div>
              <div className="hero-stat-label">Courses</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">1000+</div>
              <div className="hero-stat-label">Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with Sidebar Layout */}
      <div className="layout-main">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">
              <span>Filters</span>
              <button
                onClick={() => setFilters({ type: 'All', state: '', sort: 'rating', page: 1 })}
                className="sidebar-reset"
              >
                Reset
              </button>
            </div>
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="content">
          {/* Results Header */}
          <div className="results-header">
            Showing <strong>{filteredColleges.length}</strong> of <strong>{allColleges.length}</strong> colleges
          </div>

          {/* College Cards */}
          {paginatedColleges.length > 0 ? (
            <div className="cards-list">
              {paginatedColleges.map((college, i) => (
                <div key={college.id} className={`stagger-${(i % 4) + 1} animate-fade-in-up`}>
                  <CollegeCard college={college} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
              <p style={{ fontSize: '48px', marginBottom: 'var(--spacing-lg)' }}>🔍</p>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                No colleges found
              </h3>
              <p style={{ fontSize: '13px', marginTop: 'var(--spacing-sm)', color: 'var(--color-text-muted)' }}>
                We couldn't find any colleges matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ type: 'All', state: '', sort: 'rating', page: 1 });
                }}
                className="btn btn-secondary"
                style={{ marginTop: 'var(--spacing-lg)' }}
              >
                Clear Search & Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            />
          )}
        </main>
      </div>

      {/* Bottom spacer for compare bar */}
      <div style={{ height: '80px' }} />

      <CompareBar />
    </div>
  );
}

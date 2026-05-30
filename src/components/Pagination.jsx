export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        id="pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        ← Prev
      </button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="pagination-btn" style={{cursor: 'default', border: 'none', background: 'transparent'}}>
            …
          </span>
        ) : (
          <button
            key={page}
            id={`pagination-page-${page}`}
            onClick={() => onPageChange(page)}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        )
      )}

      <button
        id="pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-white hover:text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </nav>
  );
}

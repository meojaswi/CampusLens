import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCollegeById } from '../api/colleges';
import { useAppContext } from '../context/AppContext';
import RatingStars from '../components/RatingStars';
import StatCard from '../components/StatCard';
import TabNav from '../components/TabNav';

const typeColors = {
  Government: 'badge-blue',
  Private: 'badge-purple',
  Deemed: 'badge-purple',
};

const logoColors = {
  Government: 'bg-blue-600',
  Private: 'bg-purple-600',
  Deemed: 'bg-violet-600',
};

function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function formatFees(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} L`;
  return `₹${(amount / 1000).toFixed(0)}K`;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'courses', label: 'Courses' },
  { id: 'placements', label: 'Placements' },
  { id: 'reviews', label: 'Reviews' },
];

export default function CollegeDetail() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [localReviews, setLocalReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, comment: '', pros: '', cons: '' });

  const { addToCompare, removeFromCompare, isComparing, compareList, maxCompare, toggleSave, isSaved } = useAppContext();

  useEffect(() => {
    fetchCollegeById(id)
      .then((data) => {
        if (data) {
          setCollege(data);
          setLocalReviews(data.reviews || []);
        }
      })
      .catch((err) => {
        console.error('Error loading college:', err);
      });
  }, [id]);

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted">Loading college details...</p>
        </div>
      </div>
    );
  }

  const comparing = isComparing(college.id);
  const saved = isSaved(college.id);
  const canAdd = compareList.length < maxCompare;
  const lc = logoColors[college.type] || logoColors.Deemed;
  const tc = typeColors[college.type] || typeColors.Deemed;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      author: reviewForm.author || 'Anonymous',
      year: new Date().getFullYear().toString(),
      rating: parseInt(reviewForm.rating),
      comment: reviewForm.comment,
      pros: reviewForm.pros,
      cons: reviewForm.cons,
    };
    setLocalReviews([newReview, ...localReviews]);
    setReviewForm({ author: '', rating: 5, comment: '', pros: '', cons: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-on-surface font-medium truncate">{college.name}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card p-6 sm:p-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo */}
            <div className={`w-20 h-20 ${lc} rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
              {college.logo}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">{college.name}</h1>
              <p className="text-muted mt-1">📍 {college.city}, {college.state}</p>
              <div className="mt-3">
                <RatingStars rating={college.rating} size="md" />
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`badge ${tc}`}>{college.type}</span>
                {college.naac && (
                  <span className={`badge ${college.naac === 'A++' ? 'badge-green' : 'badge-gray'}`}>
                    NAAC {college.naac}
                  </span>
                )}
                {college.nirfRank && (
                  <span className="badge badge-amber">NIRF #{college.nirfRank}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tab Nav (sticky) */}
            <div className="sticky top-16 z-20 bg-surface -mx-1 px-1 pt-2 pb-0">
              <div className="card">
                <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6 animate-fade-in" key={activeTab}>
              {/* ===== OVERVIEW ===== */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold text-on-surface mb-3">About {college.name}</h2>
                    <p className="text-muted leading-relaxed">{college.overview}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard label="Established" value={college.established} icon="🏛️" />
                    <StatCard label="Students" value={college.totalStudents?.toLocaleString('en-IN')} icon="👨‍🎓" />
                    <StatCard label="Type" value={college.type} icon="🏫" />
                    <StatCard label="NAAC Grade" value={college.naac || 'N/A'} icon="⭐" />
                  </div>
                </div>
              )}

              {/* ===== COURSES ===== */}
              {activeTab === 'courses' && (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface border-b border-border">
                          <th className="text-left py-3.5 px-5 font-semibold text-on-surface">Course</th>
                          <th className="text-left py-3.5 px-5 font-semibold text-on-surface">Duration</th>
                          <th className="text-right py-3.5 px-5 font-semibold text-on-surface">Seats</th>
                          <th className="text-right py-3.5 px-5 font-semibold text-on-surface">Annual Fees</th>
                        </tr>
                      </thead>
                      <tbody className="table-striped">
                        {college.courses.map((course, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-blue-50/40 transition-colors">
                            <td className="py-3.5 px-5 font-medium text-on-surface">{course.name}</td>
                            <td className="py-3.5 px-5 text-muted">{course.duration}</td>
                            <td className="py-3.5 px-5 text-right text-muted">{course.seats}</td>
                            <td className="py-3.5 px-5 text-right font-semibold text-on-surface">
                              {formatCurrency(course.fees)}/year
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===== PLACEMENTS ===== */}
              {activeTab === 'placements' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Avg Package" value={`${college.placements.avg} LPA`} icon="💰" />
                    <StatCard label="Highest Package" value={`${college.placements.highest} LPA`} icon="🚀" />
                    <StatCard label="Placement %" value={`${college.placements.percent}%`} icon="📈" />
                  </div>

                  {/* Top Recruiters */}
                  <div className="card p-6">
                    <h3 className="text-base font-semibold text-on-surface mb-3">Top Recruiters</h3>
                    <div className="flex flex-wrap gap-2">
                      {college.placements.recruiters.map((r) => (
                        <span key={r} className="badge badge-blue">{r}</span>
                      ))}
                    </div>
                  </div>

                  {/* Cutoffs */}
                  {college.examCutoffs?.length > 0 && (
                    <div className="card overflow-hidden">
                      <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-base font-semibold text-on-surface">Exam Cutoffs</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-surface border-b border-border">
                              <th className="text-left py-3 px-5 font-semibold text-on-surface">Exam</th>
                              <th className="text-left py-3 px-5 font-semibold text-on-surface">Category</th>
                              <th className="text-right py-3 px-5 font-semibold text-on-surface">Opening Rank</th>
                              <th className="text-right py-3 px-5 font-semibold text-on-surface">Closing Rank</th>
                            </tr>
                          </thead>
                          <tbody className="table-striped">
                            {college.examCutoffs.map((cutoff, i) => (
                              <tr key={i} className="border-b border-gray-100 last:border-0">
                                <td className="py-3 px-5 font-medium text-on-surface">{cutoff.exam}</td>
                                <td className="py-3 px-5 text-muted">{cutoff.category}</td>
                                <td className="py-3 px-5 text-right font-semibold text-success">{cutoff.rankMin}</td>
                                <td className="py-3 px-5 text-right font-semibold text-on-surface">{cutoff.rankMax}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== REVIEWS ===== */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-on-surface">
                      Student Reviews ({localReviews.length})
                    </h3>
                    <button
                      id="write-review-btn"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="btn-secondary text-sm"
                    >
                      {showReviewForm ? 'Cancel' : '✍️ Write a Review'}
                    </button>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="card p-6 animate-slide-down space-y-4">
                      <h4 className="font-semibold text-on-surface">Share Your Experience</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Your Name</label>
                          <input
                            id="review-author"
                            type="text"
                            value={reviewForm.author}
                            onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                            placeholder="Enter your name"
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Rating</label>
                          <select
                            id="review-rating"
                            value={reviewForm.rating}
                            onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                            className="select w-full"
                          >
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Comment</label>
                        <textarea
                          id="review-comment"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Share your experience..."
                          rows={3}
                          className="input resize-none"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Pros</label>
                          <input
                            id="review-pros"
                            type="text"
                            value={reviewForm.pros}
                            onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })}
                            placeholder="e.g. Great faculty, Good placements"
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Cons</label>
                          <input
                            id="review-cons"
                            type="text"
                            value={reviewForm.cons}
                            onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                            placeholder="e.g. High fees, Remote location"
                            className="input"
                          />
                        </div>
                      </div>
                      <button type="submit" id="review-submit-btn" className="btn-primary text-sm">
                        Submit Review
                      </button>
                    </form>
                  )}

                  {/* Review Cards */}
                  {localReviews.map((review) => (
                    <div key={review.id} className="card p-5 animate-fade-in-up">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface text-sm">{review.author}</p>
                              <p className="text-xs text-muted">Class of {review.year}</p>
                            </div>
                          </div>
                        </div>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      <p className="text-muted mt-3 text-sm leading-relaxed">{review.comment}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        {review.pros && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-medium text-success">Pros:</span>
                            {review.pros.split(',').map((p, i) => (
                              <span key={i} className="badge badge-green text-xs">{p.trim()}</span>
                            ))}
                          </div>
                        )}
                        {review.cons && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-medium text-danger">Cons:</span>
                            {review.cons.split(',').map((c, i) => (
                              <span key={i} className="badge badge-red text-xs">{c.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Quick Stats */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-on-surface mb-4">Quick Facts</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted">Fee Range</dt>
                    <dd className="text-sm font-semibold text-on-surface">
                      {formatFees(college.feesMin)} – {formatFees(college.feesMax)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted">Avg Package</dt>
                    <dd className="text-sm font-semibold text-on-surface">{college.placements.avg} LPA</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted">Placement %</dt>
                    <dd className="text-sm font-semibold text-success">{college.placements.percent}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted">Established</dt>
                    <dd className="text-sm font-semibold text-on-surface">{college.established}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted">NIRF Rank</dt>
                    <dd className="text-sm font-semibold text-on-surface">#{college.nirfRank}</dd>
                  </div>
                </dl>
              </div>

              {/* Action Buttons */}
              <div className="card p-5 space-y-3">
                <button
                  id="sidebar-save-btn"
                  onClick={() => toggleSave(college)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    saved
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      : 'bg-surface text-on-surface border border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  <span className="text-lg">{saved ? '❤️' : '🤍'}</span>
                  {saved ? 'Saved' : 'Save College'}
                </button>
                <button
                  id="sidebar-compare-btn"
                  onClick={() => {
                    if (comparing) removeFromCompare(college.id);
                    else if (canAdd) addToCompare(college);
                  }}
                  disabled={!comparing && !canAdd}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    comparing
                      ? 'btn-primary'
                      : canAdd
                      ? 'btn-secondary'
                      : 'border border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {comparing ? '✓ Added to Compare' : '+ Add to Compare'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

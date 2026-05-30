import { useState } from 'react';
import { Link } from 'react-router-dom';
import { colleges, examOptions, categoryOptions } from '../data/mockColleges';
import ChanceBadge from '../components/ChanceBadge';

function predict(exam, rank, category) {
  const results = [];
  for (const college of colleges) {
    for (const cutoff of college.examCutoffs) {
      if (cutoff.exam !== exam) continue;
      if (cutoff.category !== category) continue;

      const { rankMin, rankMax } = cutoff;
      const buffer = (rankMax - rankMin) * 0.2;

      let chance;
      if (rank <= rankMax - buffer) chance = 'High';
      else if (rank <= rankMax + buffer) chance = 'Medium';
      else if (rank <= rankMax * 1.5) chance = 'Low';
      else continue;

      results.push({ college, cutoff, chance });
    }
  }
  const order = { High: 0, Medium: 1, Low: 2 };
  return results.sort((a, b) => order[a.chance] - order[b.chance]);
}

export default function Predictor() {
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exam || !rank || !category) return;
    const res = predict(exam, parseInt(rank), category);
    setResults(res);
    setHasSearched(true);
  };

  const grouped = results
    ? {
        High: results.filter((r) => r.chance === 'High'),
        Medium: results.filter((r) => r.chance === 'Medium'),
        Low: results.filter((r) => r.chance === 'Low'),
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="hero-gradient text-white py-12 sm:py-16 relative">
        <div className="w-full flex justify-center">
          <div className="max-w-3xl w-full px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight animate-fade-in-up">
            🎯 College Predictor
          </h1>
          <p className="mt-3 text-lg text-blue-100 font-light animate-fade-in-up stagger-1">
            Enter your exam rank and discover which colleges you can get into
          </p>
        </div>
        </div>
      </section>

      <div className="flex-1 w-full flex justify-center">
        <div className="max-w-3xl w-full px-4 sm:px-6 -mt-8 relative z-10">
          {/* Predictor Form */}
          <form
            onSubmit={handleSubmit}
            className="card p-6 sm:p-8 shadow-xl animate-fade-in-up stagger-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Exam
                </label>
                <select
                  id="predictor-exam"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="select w-full"
                  required
                >
                  <option value="">Select Exam</option>
                  {examOptions.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Your Rank
                </label>
                <input
                  id="predictor-rank"
                  type="number"
                  min="1"
                  max="200000"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g. 5000"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Category
                </label>
                <select
                  id="predictor-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select w-full"
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" id="predictor-submit" className="btn-primary w-full mt-6 py-3.5 text-base">
              Find My Colleges →
            </button>
          </form>

          {/* Results */}
          {hasSearched && (
            <div className="mt-8 pb-12 animate-fade-in-up">
              {results && results.length > 0 ? (
                <div className="space-y-8">
                {['High', 'Medium', 'Low'].map((tier) => {
                  const items = grouped[tier];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={tier}>
                      <div className="flex items-center gap-3 mb-4">
                        <ChanceBadge chance={tier} />
                        <span className="text-sm text-muted">
                          {items.length} college{items.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {items.map((result, i) => (
                          <div
                            key={`${result.college.id}-${result.cutoff.category}-${i}`}
                            className="card p-5 animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.05}s` }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 ${
                                  result.college.type === 'Government'
                                    ? 'bg-blue-600'
                                    : 'bg-violet-600'
                                } rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                                  {result.college.logo}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-on-surface">
                                    {result.college.name}
                                  </h3>
                                  <p className="text-xs text-muted">
                                    {result.cutoff.exam} • {result.cutoff.category} • Cutoff: {result.cutoff.rankMin}–{result.cutoff.rankMax}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-xs text-muted">Your Rank</p>
                                  <p className="text-sm font-bold text-on-surface">{rank}</p>
                                </div>
                                <Link
                                  to={`/college/${result.college.id}`}
                                  className="btn-secondary text-sm py-2 px-3"
                                >
                                  View →
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <p className="text-5xl mb-4">😔</p>
                <h3 className="text-lg font-semibold text-on-surface">No Matching Colleges</h3>
                <p className="text-muted mt-2 max-w-md mx-auto">
                  We couldn't find colleges matching your rank for this exam and category.
                  Try a different exam or category to see more results.
                </p>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

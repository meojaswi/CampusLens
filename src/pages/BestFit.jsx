import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { colleges, examOptions, categoryOptions } from '../data/mockColleges';
import { streamRecommendations } from '../api/advisorApi';
import { useAuth } from '../hooks/useAuth';

export default function BestFit() {
  const { token } = useAuth();
  
  // Form state
  const [budget, setBudget] = useState('600000');
  const [branch, setBranch] = useState('B.Tech CSE');
  const [state, setState] = useState('');
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [priorities, setPriorities] = useState([]);

  // Stream state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawStreamText, setRawStreamText] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  // Ref to cancel ongoing fetch
  const abortControllerRef = useRef(null);
  const streamEndRef = useRef(null);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-scroll stream box as it prints
  useEffect(() => {
    if (isLoading && streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }, [rawStreamText, isLoading]);

  // Priorities list
  const priorityOptions = [
    'Placement Rate',
    'High Salary Package',
    'Low Tuition Fees',
    'NIRF Ranking',
    'Research Output',
    'Campus Life & Sports',
    'Location/Metro City',
    'Brand Value'
  ];

  const handlePriorityChange = (p) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter((item) => item !== p));
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!budget || !branch) return;

    // Reset stream state
    setIsLoading(true);
    setError(null);
    setRawStreamText('');
    setRecommendations([]);

    // Abort previous stream if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const payload = {
      budget: parseInt(budget),
      branch,
      state: state || undefined,
      exam: exam || undefined,
      rank: rank ? parseInt(rank) : undefined,
      category,
      priorities
    };

    const controller = streamRecommendations(
      payload,
      token,
      // onChunk
      (chunk) => {
        setRawStreamText((prev) => {
          const updated = prev + chunk;
          
          // Parse JSON dynamically as it stream-updates
          const parsedRecs = extractJSONBlock(updated);
          if (parsedRecs) {
            setRecommendations(parsedRecs);
          }
          return updated;
        });
      },
      // onError
      (errMsg) => {
        setError(errMsg);
        setIsLoading(false);
      },
      // onDone
      () => {
        setIsLoading(false);
      }
    );

    abortControllerRef.current = controller;
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  // Helper to extract JSON rankings from stream content
  const extractJSONBlock = (text) => {
    const startMarker = '<!--RANKINGS_JSON-->';
    const endMarker = '<!--/RANKINGS_JSON-->';
    
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return null;
    
    const endIndex = text.indexOf(endMarker, startIndex + startMarker.length);
    let jsonString = '';
    
    if (endIndex === -1) {
      jsonString = text.slice(startIndex + startMarker.length).trim();
    } else {
      jsonString = text.slice(startIndex + startMarker.length, endIndex).trim();
    }

    // Clean code block wrappers if any
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7);
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3);
    }
    jsonString = jsonString.trim();

    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // JSON is incomplete while streaming
    }
    return null;
  };

  // Custom parser to translate Claude's markdown to JSX (ignoring the JSON block)
  const renderMarkdown = (text) => {
    const jsonRegex = /<!--RANKINGS_JSON-->[\s\S]*?(<!--\/RANKINGS_JSON-->|$)/g;
    const cleanText = text.replace(jsonRegex, '').trim();

    const lines = cleanText.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-on-surface border-b pb-2 border-border">
            {trimmed.slice(3)}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-on-surface">
            {trimmed.slice(4)}
          </h3>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={index} className="ml-5 list-disc mb-1 text-on-surface">
            {parseBoldText(trimmed.slice(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={index} className="ml-5 list-decimal mb-1 text-on-surface">
            {parseBoldText(trimmed.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (!trimmed) {
        return <div key={index} className="h-2"></div>;
      }
      return (
        <p key={index} className="mb-3 text-on-surface">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  const parseBoldText = (text) => {
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    if (parts.length === 1) return text;
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-on-surface">{part}</strong>;
      }
      return part;
    });
  };

  // Get distinct list of states for selection
  const uniqueStates = [...new Set(colleges.map((c) => c.state))].sort();

  return (
    <div className="advisor-container">
      <div className="advisor-header">
        <h1 className="advisor-title">Find My Best Fit</h1>
        <p className="advisor-subtitle">
          Input your preferences and let our counselor-trained AI analyze our college database to find your perfect matches.
        </p>
      </div>

      <div className="advisor-grid">
        {/* Preference Form Sidebar */}
        <div className="advisor-form-card">
          <h2 className="text-lg font-semibold text-on-surface mb-4">Your Profile & Preferences</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="budget">Annual Budget (Tuition + Hostel)</label>
              <select
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-select"
                required
              >
                <option value="150000">Up to ₹1.5 Lakh / year</option>
                <option value="300000">Up to ₹3.0 Lakh / year</option>
                <option value="600000">Up to ₹6.0 Lakh / year</option>
                <option value="1200000">Up to ₹12.0 Lakh / year</option>
                <option value="2500000">Up to ₹25.0 Lakh / year</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="branch">Preferred Branch / Course</label>
              <input
                id="branch"
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. B.Tech CSE, MBA"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">Preferred Location (State)</label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="form-select"
              >
                <option value="">Anywhere in India</option>
                {uniqueStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label htmlFor="exam">Exam Taken</label>
                <select
                  id="exam"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="form-select"
                >
                  <option value="">No Exam</option>
                  {examOptions.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="rank">Your Rank / Percentile</label>
                <input
                  id="rank"
                  type="number"
                  min="1"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g. 2500"
                  className="form-input"
                  disabled={!exam}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>My Top Priorities</label>
              <div className="priority-checkboxes">
                {priorityOptions.map((p) => (
                  <label key={p} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={priorities.includes(p)}
                      onChange={() => handlePriorityChange(p)}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            {!isLoading ? (
              <button type="submit" className="advisor-btn">
                ✨ Generate AI Recommendations
              </button>
            ) : (
              <button type="button" onClick={handleCancel} className="advisor-btn bg-danger hover:bg-danger">
                🛑 Cancel Streaming
              </button>
            )}
          </form>
        </div>

        {/* Streaming & Parsed Results Area */}
        <div className="advisor-results">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-200 text-red-700">
              <h3 className="font-semibold mb-1">Configuration Required</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Parsed Recommendations Cards */}
          {recommendations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-on-surface mb-4">Ranked Matches</h2>
              <div className="rec-cards-container">
                {recommendations.map((rec) => {
                  const college = colleges.find((c) => c.id === rec.collegeId);
                  if (!college) return null;

                  const fitClass = rec.fitScore >= 85 ? 'high' : rec.fitScore >= 60 ? 'medium' : 'low';
                  const fitLabel = rec.fitScore >= 85 ? 'Excellent' : rec.fitScore >= 60 ? 'Good' : 'Moderate';

                  return (
                    <Link key={rec.collegeId} to={`/college/${college.id}`} className="rec-card">
                      <div className="rec-rank-badge">{rec.rank}</div>
                      
                      <div className="rec-info">
                        <h3>{college.name}</h3>
                        <p className="text-xs text-muted mb-2">
                          📍 {college.city}, {college.state} • {college.type} College • NIRF Rank #{college.nirfRank}
                        </p>
                        <p className="rec-verdict">"{rec.verdict}"</p>
                        
                        <div className="rec-tags">
                          {rec.reasons.map((reason, idx) => (
                            <span key={idx} className="rec-tag">🎯 {reason}</span>
                          ))}
                        </div>
                      </div>

                      <div className="rec-score-wrapper">
                        <div className={`fit-score-circle ${fitClass}`}>{rec.fitScore}%</div>
                        <div className="fit-score-label">{fitLabel} Fit</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Streaming Markdown Output */}
          {rawStreamText ? (
            <div>
              <h2 className="text-lg font-semibold text-on-surface mb-2">Detailed AI Consultation</h2>
              <div className="stream-box">
                {renderMarkdown(rawStreamText)}
                {isLoading && <span className="typing-cursor"></span>}
                <div ref={streamEndRef} />
              </div>
            </div>
          ) : (
            !error && (
              <div className="empty-state">
                <span className="empty-state-icon">🤖</span>
                <h3 className="text-base font-semibold text-on-surface mb-1">Awaiting Your Preferences</h3>
                <p className="text-sm text-muted max-w-sm">
                  Fill in your academic profile and priorities on the left, then click generate.
                  Your AI advisor will stream detailed feedback token-by-token.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

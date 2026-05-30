import { Router } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();

// Get the directory of the current file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load colleges data
const collegesPath = join(__dirname, '../data/colleges.json');
let colleges = JSON.parse(readFileSync(collegesPath, 'utf-8'));

// Get all colleges with filtering, sorting, and pagination
router.get('/', (req, res) => {
  try {
    let filtered = [...colleges];

    // Filter by type
    if (req.query.type && req.query.type !== 'All') {
      filtered = filtered.filter(c => c.type === req.query.type);
    }

    // Filter by state
    if (req.query.state) {
      filtered = filtered.filter(c => c.state === req.query.state);
    }

    // Filter by search query
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.city.toLowerCase().includes(search) ||
        c.overview.toLowerCase().includes(search)
      );
    }

    // Sort
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'fees-low':
          filtered.sort((a, b) => a.feesMin - b.feesMin);
          break;
        case 'fees-high':
          filtered.sort((a, b) => b.feesMax - a.feesMax);
          break;
        case 'nirf':
          filtered.sort((a, b) => (a.nirfRank || 9999) - (b.nirfRank || 9999));
          break;
        default:
          break;
      }
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedColleges = filtered.slice(startIndex, startIndex + limit);

    res.json({
      data: paginatedColleges,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single college by ID
router.get('/:id', (req, res) => {
  try {
    const college = colleges.find(c => c.id === parseInt(req.params.id));
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unique states
router.get('/states/list', (req, res) => {
  try {
    const states = [...new Set(colleges.map(c => c.state))].sort();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exam and category options
router.get('/exams/options', (req, res) => {
  try {
    const exams = [...new Set(colleges.flatMap(c => c.examCutoffs.map(e => e.exam)))];
    const categories = [...new Set(colleges.flatMap(c => c.examCutoffs.map(e => e.category)))];
    res.json({ exams, categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Predict college admissions based on exam rank
router.post('/predict', (req, res) => {
  try {
    const { exam, rank, category } = req.body;

    if (!exam || !rank || !category) {
      return res.status(400).json({ error: 'Missing required fields: exam, rank, category' });
    }

    const results = [];
    for (const college of colleges) {
      for (const cutoff of college.examCutoffs) {
        if (cutoff.exam !== exam || cutoff.category !== category) continue;

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
    results.sort((a, b) => order[a.chance] - order[b.chance]);

    res.json({
      exam,
      rank,
      category,
      results,
      grouped: {
        High: results.filter(r => r.chance === 'High'),
        Medium: results.filter(r => r.chance === 'Medium'),
        Low: results.filter(r => r.chance === 'Low'),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a review to a college
router.post('/:id/reviews', (req, res) => {
  try {
    const collegeIndex = colleges.findIndex(c => c.id === parseInt(req.params.id));
    if (collegeIndex === -1) {
      return res.status(404).json({ error: 'College not found' });
    }

    const { author, rating, comment, pros, cons } = req.body;

    if (!author || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields: author, rating, comment' });
    }

    const newReview = {
      id: Date.now(),
      author,
      year: new Date().getFullYear().toString(),
      rating: parseInt(rating),
      comment,
      pros: pros || '',
      cons: cons || '',
    };

    colleges[collegeIndex].reviews.push(newReview);

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

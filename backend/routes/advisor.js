import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const collegesPath = join(__dirname, '../data/colleges.json');
const colleges = JSON.parse(readFileSync(collegesPath, 'utf-8'));

/**
 * Build the system prompt with the full college catalog embedded as context.
 */
function buildSystemPrompt() {
  const collegeSummaries = colleges.map((c) => {
    const courseList = c.courses
      .map((co) => `${co.name} (${co.duration}, ₹${co.fees.toLocaleString('en-IN')}/yr, ${co.seats} seats)`)
      .join('; ');

    const cutoffList = c.examCutoffs
      .map((e) => `${e.exam} ${e.category}: rank ${e.rankMin}–${e.rankMax}`)
      .join('; ');

    const reviewSnippets = c.reviews
      .slice(0, 2)
      .map((r) => `"${r.comment}" — ${r.author} (${r.rating}/5)`)
      .join(' | ');

    return `
### ${c.name} (ID: ${c.id})
- **Location**: ${c.city}, ${c.state}
- **Type**: ${c.type} | **NAAC**: ${c.naac} | **NIRF Rank**: #${c.nirfRank}
- **Established**: ${c.established} | **Students**: ${c.totalStudents}
- **Fee Range**: ₹${c.feesMin.toLocaleString('en-IN')} – ₹${c.feesMax.toLocaleString('en-IN')}/year
- **Courses**: ${courseList}
- **Placements**: Avg ${c.placements.avg} LPA, Highest ${c.placements.highest} LPA, ${c.placements.percent}% placed
- **Top Recruiters**: ${c.placements.recruiters.join(', ')}
- **Exam Cutoffs**: ${cutoffList}
- **Student Reviews**: ${reviewSnippets}
`;
  });

  return `You are CampusLens AI — an expert Indian higher-education counselor embedded in the CampusLens platform. You provide personalized, data-driven college recommendations.

## Your College Database
${collegeSummaries.join('\n')}

## Your Task
When a student provides their preferences (budget, branch, state, exam rank, category, priorities), you must:

1. **Analyze every college** in the database against the student's profile.
2. **Rank them** from best fit to worst fit.
3. **Explain your reasoning** in a warm, encouraging, and expert tone.

## Response Format

You MUST include a JSON block wrapped in special markers. This block will be parsed by the frontend to render recommendation cards.

First, write a brief 1-2 sentence introduction addressing the student.

Then output the structured data block in EXACTLY this format:

<!--RANKINGS_JSON-->
[
  {
    "collegeId": 1,
    "rank": 1,
    "fitScore": 92,
    "verdict": "One-line personalized verdict",
    "reasons": ["Reason 1", "Reason 2", "Reason 3"]
  }
]
<!--/RANKINGS_JSON-->

Rules for the JSON block:
- Include ALL colleges from the database, ranked from best to worst fit
- fitScore is 0-100 (100 = perfect fit)
- verdict is a concise, personalized one-liner for this specific student
- reasons array has 2-4 short reason strings
- Only include colleges that have at least SOME relevance (fitScore >= 20)

After the JSON block, write a detailed analysis section with:
- **Why each recommended college is a good fit** (2-3 sentences per college)
- **Potential concerns** to be aware of
- **Final advice** — a warm, encouraging closing paragraph

Use markdown formatting. Use emoji sparingly for visual appeal (🎯, ✅, ⚠️, 💡).
Keep the total response under 1500 words.`;
}

/**
 * Build the user message from form data.
 */
function buildUserMessage(data) {
  const { budget, branch, state, exam, rank, category, priorities } = data;

  let msg = `Here are my preferences for finding the best college:\n\n`;
  msg += `- **Annual Budget**: ₹${parseInt(budget).toLocaleString('en-IN')}\n`;
  msg += `- **Preferred Branch/Course**: ${branch}\n`;

  if (state) msg += `- **Preferred State/Location**: ${state}\n`;
  if (exam) msg += `- **Exam**: ${exam}\n`;
  if (rank) msg += `- **My Rank**: ${rank}\n`;
  if (category) msg += `- **Category**: ${category}\n`;

  if (priorities && priorities.length > 0) {
    msg += `- **My Priorities**: ${priorities.join(', ')}\n`;
  }

  msg += `\nPlease analyze all colleges and give me your ranked recommendations.`;
  return msg;
}

/**
 * POST /api/advisor/recommend
 * Streams Claude's response via SSE.
 * Requires authentication.
 */
router.post('/recommend', verifyToken, async (req, res) => {
  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI advisor is not configured. Please add ANTHROPIC_API_KEY to the backend .env file.',
    });
  }

  // Validate input
  const { budget, branch } = req.body;
  if (!budget || !branch) {
    return res.status(400).json({
      error: 'Missing required fields: budget and branch are required.',
    });
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    const client = new Anthropic({ apiKey });
    const systemPrompt = buildSystemPrompt();
    const userMessage = buildUserMessage(req.body);

    const stream = await client.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.text) {
        const chunk = event.delta.text;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }
    }

    // Send done signal
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Claude API error:', error.message || error);

    // If headers already sent, send error as SSE event
    if (res.headersSent) {
      res.write(
        `data: ${JSON.stringify({ type: 'error', content: error.message || 'An error occurred while generating recommendations. Please try again.' })}\n\n`
      );
      res.end();
    } else {
      res.status(502).json({ error: error.message || 'Failed to get AI recommendations. Please try again.' });
    }
  }

  // Handle client disconnect
  req.on('close', () => {
    // Connection closed by client — stream will be garbage collected
  });
});

export default router;

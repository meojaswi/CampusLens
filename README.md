# CampusLens

A web application that helps students find and compare colleges, predict their acceptance chances, and get personalized advisor recommendations.

## What It Does

**CampusLens** makes college selection easier by combining college data, acceptance predictors, and AI-powered advising all in one place. Whether you're looking for your best fit school or trying to understand your odds, we've got you covered.

## Features

- **College Search & Comparison** — Browse colleges by ratings, acceptance rates, location, and more. Compare multiple schools side-by-side to make informed decisions
- **Acceptance Predictor** — Get realistic insights into your admission chances based on your stats
- **College Advisor** — Chat with an AI advisor for personalized guidance on college selection
- **Smart Filtering** — Narrow down by location, difficulty level, program type, and other factors
- **Saved Favorites** — Keep track of colleges you're interested in
- **Secure Accounts** — Sign up and save your preferences across devices

## Tech Stack

**Frontend:**
- React 18 with Vite
- Context API for state management
- Responsive design with modern CSS

**Backend:**
- Node.js with Express
- User authentication & data management
- API endpoints for colleges, advisors, and auth

## Getting Started

### Prerequisites
- Node.js installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repo
```bash
git clone https://github.com/meojaswi/CampusLens.git
cd CampusLens
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

### Running Locally

**Frontend (development):**
```bash
npm run dev
```
Opens at `http://localhost:5173`

**Backend (development):**
```bash
cd backend
node server.js
```
Runs on `http://localhost:3000`

## Project Structure

```
├── src/                 # Frontend (React)
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # State management
│   ├── hooks/          # Custom React hooks
│   └── api/            # API integration
│
├── backend/            # Node.js server
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth & other middleware
│   ├── data/           # College data
│   └── utils/          # Helper functions
│
└── public/             # Static assets
```

## Deployment

This project can be deployed on **Cloudflare**:
- **Frontend** → Cloudflare Pages
- **Backend** → Cloudflare Workers

See deployment docs for setup instructions.

## Contributing

Found a bug or have an idea? Feel free to open an issue or submit a pull request.

## License

MIT License — feel free to use this project however you'd like.

---

Built with ❤️ by the Ojaswi
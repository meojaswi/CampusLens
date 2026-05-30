# CampusLens Backend API

A Node.js/Express backend server for the CampusLens college discovery platform.

## Features

- 🎓 College data management and filtering
- 🔍 Advanced search with sorting and pagination
- 📊 College comparison endpoints
- 🎯 Admission prediction based on exam ranks
- ⭐ Student reviews management
- ⚡ CORS enabled for frontend integration
- 🌐 RESTful API design

## Prerequisites

- Node.js 16+ (with npm)

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file in the backend directory:

```env
# Backend Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Colleges

#### Get all colleges
```
GET /api/colleges?page=1&limit=12&type=Government&state=Maharashtra&sort=rating&search=IIT
```

**Query Parameters:**
- `page` (default: 1) - Page number for pagination
- `limit` (default: 12) - Number of items per page
- `type` - Filter by college type (Government, Private, Deemed)
- `state` - Filter by state
- `sort` - Sort by: rating, fees-low, fees-high, nirf
- `search` - Search by name, city, or overview

**Response:**
```json
{
  "data": [...colleges],
  "total": 100,
  "page": 1,
  "limit": 12,
  "totalPages": 9
}
```

#### Get single college
```
GET /api/colleges/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "IIT Bombay",
  "city": "Mumbai",
  "state": "Maharashtra",
  ...
}
```

#### Get states list
```
GET /api/colleges/states/list
```

**Response:**
```json
["Maharashtra", "Tamil Nadu", "Delhi", ...]
```

#### Get exam options
```
GET /api/colleges/exams/options
```

**Response:**
```json
{
  "exams": ["JEE Advanced", "JEE Main", "BITSAT", ...],
  "categories": ["General", "OBC", "SC", "ST", "EWS"]
}
```

#### Predict college admissions
```
POST /api/colleges/predict
```

**Request Body:**
```json
{
  "exam": "JEE Advanced",
  "rank": 500,
  "category": "General"
}
```

**Response:**
```json
{
  "exam": "JEE Advanced",
  "rank": 500,
  "category": "General",
  "results": [...],
  "grouped": {
    "High": [...],
    "Medium": [...],
    "Low": [...]
  }
}
```

#### Add review
```
POST /api/colleges/:id/reviews
```

**Request Body:**
```json
{
  "author": "John Doe",
  "rating": 5,
  "comment": "Great college with excellent faculty",
  "pros": "Good placements, Strong faculty",
  "cons": "Competitive environment"
}
```

## Data Structure

### College Object
```json
{
  "id": 1,
  "name": "IIT Bombay",
  "city": "Mumbai",
  "state": "Maharashtra",
  "type": "Government",
  "rating": 4.8,
  "feesMin": 80000,
  "feesMax": 250000,
  "logo": "IITB",
  "established": 1958,
  "naac": "A++",
  "nirfRank": 1,
  "totalStudents": 10000,
  "overview": "Premier technical institute...",
  "courses": [...],
  "placements": {...},
  "reviews": [...],
  "examCutoffs": [...]
}
```

## Integration with Frontend

1. Ensure the backend is running on `http://localhost:5000`
2. Set `VITE_API_URL=http://localhost:5000/api` in frontend `.env` file
3. The frontend will automatically use the backend API

If `VITE_API_URL` is not set, the frontend will use mock data as fallback.

## Directory Structure

```
backend/
├── server.js          # Express server setup
├── package.json       # Dependencies
├── .env               # Environment configuration
├── routes/
│   └── colleges.js    # College API routes
└── data/
    └── colleges.json  # College data
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

Error responses follow this format:
```json
{
  "error": "Error message",
  "message": "Detailed error information (if available)"
}
```

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- User authentication and profiles
- Wishlist/bookmark functionality
- Advanced analytics and reporting
- Email notifications
- Admin dashboard
- File uploads for college documents

## License

MIT

## Support

For issues or questions, please open an issue in the main repository.

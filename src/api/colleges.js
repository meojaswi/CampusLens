import axios from 'axios';
import { colleges as mockData } from '../data/mockColleges';

const BASE_URL = import.meta.env.VITE_API_URL || null;

// Fetch all colleges with filtering, sorting, and pagination
export const fetchColleges = async (params = {}) => {
  if (!BASE_URL) {
    // Fallback to mock data if no backend is configured
    let filtered = [...mockData];

    if (params.type && params.type !== 'All') {
      filtered = filtered.filter(c => c.type === params.type);
    }
    if (params.state) {
      filtered = filtered.filter(c => c.state === params.state);
    }
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.city.toLowerCase().includes(search)
      );
    }

    return {
      data: filtered,
      total: filtered.length,
      page: 1,
      limit: 12,
      totalPages: Math.ceil(filtered.length / 12),
    };
  }

  try {
    const res = await axios.get(`${BASE_URL}/colleges`, { params });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch colleges:', error);
    throw error;
  }
};

// Fetch single college by ID
export const fetchCollegeById = async (id) => {
  if (!BASE_URL) {
    // Return mock data as a Promise
    const college = mockData.find((c) => c.id === parseInt(id));
    return college;
  }

  try {
    const res = await axios.get(`${BASE_URL}/colleges/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch college with id ${id}:`, error);
    throw error;
  }
};

// Get prediction for college admissions
export const predictColleges = async (exam, rank, category) => {
  if (!BASE_URL) {
    return mockData;
  }

  try {
    const res = await axios.post(`${BASE_URL}/colleges/predict`, {
      exam,
      rank: parseInt(rank),
      category,
    });
    return res.data;
  } catch (error) {
    console.error('Failed to predict colleges:', error);
    throw error;
  }
};

// Add review to a college
export const addReview = async (collegeId, reviewData) => {
  if (!BASE_URL) {
    throw new Error('Backend not configured');
  }

  try {
    const res = await axios.post(`${BASE_URL}/colleges/${collegeId}/reviews`, reviewData);
    return res.data;
  } catch (error) {
    console.error('Failed to add review:', error);
    throw error;
  }
};

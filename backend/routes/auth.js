import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { findUserByEmail, createUser } from '../utils/userDb.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/google
 * Authenticate user with Google token
 */
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Google token is required'
      });
    }

    // Decode the Google JWT token to get user info
    // In production, you should verify this token with Google's API
    let decodedToken;
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      // For now, we'll just decode without verification
      // In production: verify with Google's public keys
      decodedToken = jwt.decode(token);
    } catch (err) {
      return res.status(401).json({
        error: 'Invalid Google token'
      });
    }

    if (!decodedToken || !decodedToken.email) {
      return res.status(401).json({
        error: 'Invalid Google token data'
      });
    }

    const { email, name, picture } = decodedToken;

    // Check if user exists
    let user = findUserByEmail(email);

    // If user doesn't exist, create them
    if (!user) {
      const userId = uuidv4();
      user = createUser(userId, email, null, name || email.split('@')[0], picture);
    }

    // Generate JWT token for our app
    const appToken = generateToken(user.id, user.email);

    res.json({
      message: 'Google authentication successful',
      token: appToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        savedColleges: user.savedColleges || [],
        preferences: user.preferences || {}
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

/**
 * POST /api/auth/verify
 * Verify token (check if user is authenticated)
 */
router.post('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, userId: decoded.id });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

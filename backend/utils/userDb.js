import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const usersPath = join(__dirname, './users.json');

/**
 * Get all users
 */
export function getAllUsers() {
  try {
    const data = readFileSync(usersPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

/**
 * Find user by email
 */
export function findUserByEmail(email) {
  const users = getAllUsers();
  return users.find(u => u.email === email.toLowerCase());
}

/**
 * Find user by ID
 */
export function findUserById(id) {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

/**
 * Create new user
 */
export function createUser(id, email, hashedPassword, name, picture) {
  const users = getAllUsers();
  const newUser = {
    id,
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    picture: picture || null,
    createdAt: new Date().toISOString(),
    savedColleges: [],
    preferences: {}
  };
  users.push(newUser);
  writeFileSync(usersPath, JSON.stringify(users, null, 2));
  return newUser;
}

/**
 * Update user saved colleges
 */
export function addSavedCollege(userId, collegeId) {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    if (!user.savedColleges) user.savedColleges = [];
    if (!user.savedColleges.includes(collegeId)) {
      user.savedColleges.push(collegeId);
      writeFileSync(usersPath, JSON.stringify(users, null, 2));
    }
  }
  return user;
}

/**
 * Remove saved college
 */
export function removeSavedCollege(userId, collegeId) {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  if (user && user.savedColleges) {
    user.savedColleges = user.savedColleges.filter(id => id !== collegeId);
    writeFileSync(usersPath, JSON.stringify(users, null, 2));
  }
  return user;
}

/**
 * Update user preferences
 */
export function updateUserPreferences(userId, preferences) {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.preferences = { ...user.preferences, ...preferences };
    writeFileSync(usersPath, JSON.stringify(users, null, 2));
  }
  return user;
}

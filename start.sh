#!/bin/bash

echo "🚀 Starting CampusLens deployment..."

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Check if dist folder exists
if [ -d "dist" ]; then
  echo "✅ Frontend built successfully at ./dist"
  ls -la dist/ | head -5
else
  echo "❌ ERROR: dist folder not found!"
  exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ Installation complete"
echo "🎯 Starting backend server..."
node server.js

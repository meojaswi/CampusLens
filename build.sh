#!/bin/bash

echo "🔧 Building CampusLens..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "✅ Build complete! Frontend built at ./dist"

echo "Build complete!"

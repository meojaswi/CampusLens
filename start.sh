#!/bin/bash

# Build frontend if dist doesn't exist
if [ ! -d "dist" ]; then
  echo "Building frontend..."
  npm run build
fi

# Start the backend server
# The backend will serve the built frontend from the dist folder
cd backend
node server.js

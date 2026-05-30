#!/bin/bash

echo "Building frontend..."
npm run build

echo "Installing backend dependencies..."
cd backend
npm install

echo "Starting backend server..."
node server.js

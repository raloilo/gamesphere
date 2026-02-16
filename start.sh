#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
    echo "Stopping services..."
    # Kill all child process groups
    kill 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM EXIT

echo "Starting GameSphere Development Environment..."

# Start Backend
echo "Starting Backend..."
cd backend || exit
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi
# Run backend in background
npm run dev &
cd ..

# Start Frontend
echo "Starting Frontend..."
cd frontend || exit
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
# Run frontend in background
npm run dev &
cd ..

echo "Services started!"
echo "Press Ctrl+C to stop all services."

# Wait for any process to exit
wait

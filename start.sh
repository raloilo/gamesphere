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

# Find npm executable
NPM_CMD=$(which npm)
if [ -z "$NPM_CMD" ]; then
    if [ -x "/usr/bin/npm" ]; then
        NPM_CMD="/usr/bin/npm"
    elif [ -x "/usr/local/bin/npm" ]; then
        NPM_CMD="/usr/local/bin/npm"
    else
        echo "Error: npm not found in PATH or standard locations."
        exit 1
    fi
fi

echo "Using npm at: $NPM_CMD"

# Start Backend
echo "Starting Backend..."
cd backend || exit
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    "$NPM_CMD" install
fi
# Run backend in background
"$NPM_CMD" run dev &
cd ..

# Start Frontend
echo "Starting Frontend..."
cd frontend || exit
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    "$NPM_CMD" install
fi
# Run frontend in background
"$NPM_CMD" run dev &
cd ..

echo "Services started!"
echo "Press Ctrl+C to stop all services."

# Wait for any process to exit
wait


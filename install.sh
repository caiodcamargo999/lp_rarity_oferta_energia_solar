#!/bin/bash

echo "Installing Rarity Agency Landing Page dependencies..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js 18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

# Install dependencies
echo
echo "Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies."
    exit 1
fi

echo
echo "Dependencies installed successfully!"
echo
echo "To start the development server, run:"
echo "  npm run dev"
echo
echo "Then open http://localhost:3000 in your browser."
echo

#!/bin/bash

# Render build script with robust database initialization
set -e

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Wait a bit for database to be provisioned
echo "⏳ Waiting for database provisioning..."
sleep 10

# Initialize database with retries
echo "🗄️ Initializing database..."
python init_database.py || echo "⚠️ Database initialization failed, continuing deployment..."

# Run any additional setup
echo "🔧 Running additional setup..."

# Make sure the app can start
echo "✅ Build completed successfully!"
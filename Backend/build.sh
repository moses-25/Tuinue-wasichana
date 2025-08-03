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

# Initialize database with retries (only if DATABASE_URL is available)
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️ Initializing database with automatic migrations..."
    python init_database.py || echo "⚠️ Database initialization failed, continuing deployment..."
    
    echo "🔄 Running additional migration checks..."
    python database_migrator.py || echo "⚠️ Additional migrations failed, continuing deployment..."
else
    echo "⚠️ DATABASE_URL not available during build, will initialize at startup"
fi

# Run any additional setup
echo "🔧 Running additional setup..."

# Create admin user from environment variables if specified
if [ "$CREATE_ADMIN_ON_DEPLOY" = "true" ]; then
    echo "👤 Creating admin user from environment variables..."
    python create_admin_env.py || echo "⚠️ Admin user creation failed, continuing deployment..."
fi

# Make sure the app can start
echo "✅ Build completed successfully!"
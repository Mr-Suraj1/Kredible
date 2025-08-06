#!/bin/bash

# Kredible Setup Script
# This script helps you set up Kredible with all necessary dependencies

set -e

echo "🚀 Setting up Kredible - Automated Candidate Due Diligence"
echo "======================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "Using yarn..."
    yarn install
else
    echo "Using npm..."
    npm install
fi

# Install additional required packages for the complete system
echo "📦 Installing additional required packages..."
if command -v pnpm &> /dev/null; then
    pnpm add nanoid @types/node
else
    npm install nanoid @types/node
fi

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "⚠️  Please edit .env.local with your actual configuration values"
else
    echo "✅ .env.local already exists"
fi

# Create uploads directory for file storage
mkdir -p public/uploads
echo "✅ Created uploads directory"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Kredible setup"
    echo "✅ Git repository initialized"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration values:"
echo "   - Google OAuth credentials"
echo "   - Email service API keys"
echo "   - Database connection string"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed setup instructions, see README.md"
echo ""
echo "🆘 Need help? Check the documentation or create an issue on GitHub"

#!/bin/bash

# SDD MCP Server Deployment Script

set -e

echo "🚀 SDD MCP Server Deployment Script"
echo "======================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is installed and running"

# Build the Docker image
echo "📦 Building SDD MCP Server Docker image..."
docker build -t sdd-server:latest .

echo "✅ Docker image built successfully"

# Create output directory
mkdir -p ./output

echo "🎯 SDD MCP Server is ready!"
echo ""
echo "📋 Next steps:"
echo "1. To run the server: docker run --rm -i sdd-server:latest"
echo "2. To use with docker-compose: docker-compose up -d"
echo "3. Add to your MCP configuration:"
echo ""
echo '{
  "mcpServers": {
    "sdd-server": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "sdd-server:latest"],
      "disabled": false,
      "autoApprove": []
    }
  }
}'
echo ""
echo "🎉 Deployment complete!"

#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Incident Triage Studio - MCP Server Setup                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=${PORT:-4100}
HOST=${HOST:-0.0.0.0}

echo -e "${BLUE}[1/3]${NC} Installing dependencies..."
cd "$PROJECT_DIR"
npm install

echo ""
echo -e "${BLUE}[2/3]${NC} Starting MCP server..."
echo "  Port: $PORT"
echo "  Host: $HOST"
echo ""

node mcp-server.js &
SERVER_PID=$!

sleep 3

echo ""
echo -e "${BLUE}[3/3]${NC} Testing health check..."
HEALTH=$(curl -s http://localhost:$PORT/health || echo "failed")

if echo "$HEALTH" | grep -q "healthy"; then
  echo -e "${GREEN}✓ Server is running${NC}"
  echo ""
  echo "MCP Endpoint: http://localhost:$PORT/mcp"
  echo "For Archestra (Docker): http://host.docker.internal:$PORT/mcp"
  echo ""
  echo "Process ID: $SERVER_PID"
else
  echo "✗ Health check failed"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Next Steps:                                               ║"
echo "║  1. Register in Archestra (see README.md)                  ║"
echo "║  2. Create agent with triage_incident tool                 ║"
echo "║  3. Test with sample logs                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"

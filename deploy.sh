#!/bin/bash

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Incident Triage Studio - Production Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Check if Archestra network exists
if ! docker network inspect archestra-network &>/dev/null; then
  echo -e "${YELLOW}⚠ Creating archestra-network...${NC}"
  docker network create archestra-network
fi

echo -e "${BLUE}[1/4]${NC} Building Docker image..."
docker-compose build

echo ""
echo -e "${BLUE}[2/4]${NC} Starting container..."
docker-compose up -d

echo ""
echo -e "${BLUE}[3/4]${NC} Waiting for server to be ready..."
sleep 3

echo ""
echo -e "${BLUE}[4/4]${NC} Health check..."
HEALTH=$(curl -s http://localhost:4100/health 2>/dev/null || echo "")

if echo "$HEALTH" | grep -q "healthy"; then
  echo -e "${GREEN}✓ Server is running${NC}"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Server Details"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "  MCP Endpoint:       http://localhost:4100/mcp"
  echo "  For Archestra:      http://host.docker.internal:4100/mcp"
  echo "  Health Check:       http://localhost:4100/health"
  echo ""
  echo "  Container Name:     incident-triage-studio"
  echo "  Network:            archestra-network"
  echo "  Restart Policy:     unless-stopped"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "  View logs:          docker-compose logs -f"
  echo "  Stop server:        docker-compose down"
  echo "  Restart server:     docker-compose restart"
  echo ""
else
  echo -e "${YELLOW}⚠ Server not responding, checking logs...${NC}"
  docker-compose logs --tail=20
  exit 1
fi

echo ""
echo -e "${GREEN}✓ Deployment complete${NC}"

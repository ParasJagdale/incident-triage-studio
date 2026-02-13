#!/bin/bash

# Simple process monitor for MCP server
# Keeps the server running and restarts on crash

MAX_RESTARTS=5
RESTART_COUNT=0
RESTART_WINDOW=300  # 5 minutes

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "Starting Incident Triage Studio with auto-restart..."
echo "Press Ctrl+C to stop"
echo ""

cleanup() {
  echo ""
  echo "Shutting down..."
  kill $SERVER_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

while true; do
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting MCP server..."
  
  node mcp-server.js &
  SERVER_PID=$!
  
  # Wait for process to exit
  wait $SERVER_PID
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Server stopped gracefully"
    break
  fi
  
  RESTART_COUNT=$((RESTART_COUNT + 1))
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Server crashed (exit code: $EXIT_CODE)"
  
  if [ $RESTART_COUNT -ge $MAX_RESTARTS ]; then
    echo "Max restart limit reached ($MAX_RESTARTS). Stopping."
    exit 1
  fi
  
  echo "Restarting in 5 seconds... (attempt $RESTART_COUNT/$MAX_RESTARTS)"
  sleep 5
done

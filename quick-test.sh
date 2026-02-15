#!/bin/bash

echo "Waiting for server to start..."
sleep 3

echo "Testing /health endpoint:"
curl -s http://localhost:4100/health

echo ""
echo "Testing /api/triage endpoint:"
curl -s -X POST http://localhost:4100/api/triage \
  -H 'Content-Type: application/json' \
  -d '{"logText":"ERROR: Database connection failed"}'

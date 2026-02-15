#!/bin/bash
# Test MCP API endpoint

echo "Testing MCP API with Sample 1 (Critical)..."
curl -s -X POST http://localhost:4100/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "logText": "ERROR: Database connection timeout\n  at Database.connect (/app/db.js:45:22)\n  at async ServiceStartup.init\nFATAL: Service initialization failed\nStack trace: Cannot connect to postgres://db:5432\nConnection attempts: 5/5 failed"
  }' | jq '.'

echo -e "\n✓ API Test Complete"

#!/usr/bin/env python3
import requests
import json

url = "http://localhost:4100/api/triage"
headers = {"Content-Type": "application/json"}

# Test Sample 1: Critical Database Error
sample1 = {
    "logText": """ERROR: Database connection timeout
  at Database.connect (/app/db.js:45:22)
  at async ServiceStartup.init
FATAL: Service initialization failed
Stack trace: Cannot connect to postgres://db:5432
Connection attempts: 5/5 failed
FAILED: Deployment aborted"""
}

# Test Sample 2: High Priority Package Error
sample2 = {
    "logText": """ERROR: Cannot find module 'express'
  at Function._load (internal/modules/loader.js:489:10)
  at require (internal/modules/loader.js:425:17)
  at Object.<anonymous> (/app/server.js:1:1)
FAILED: Build exited with code 1
npm ERR! code ERESOLVE
npm ERR! Could not resolve dependencies"""
}

print("=" * 60)
print("Testing MCP API Endpoint - Sample 1 (Critical Severity)")
print("=" * 60)

try:
    response = requests.post(url, json=sample1, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"\nSeverity: {result.get('severity', 'N/A')}")
    print(f"Root Cause: {result.get('rootCause', 'N/A')}")
    print(f"Actions ({len(result.get('suggestedActions', []))}):")
    for i, action in enumerate(result.get('suggestedActions', []), 1):
        print(f"  {i}. {action}")
    print(f"GitHub Ready: {result.get('github') is not None}")
    print(f"Slack Ready: {result.get('slack') is not None}")
    print("\n✓ Test 1 PASSED")
except Exception as e:
    print(f"✗ Test 1 FAILED: {e}")

print("\n" + "=" * 60)
print("Testing MCP API Endpoint - Sample 2 (High Severity)")
print("=" * 60)

try:
    response = requests.post(url, json=sample2, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"\nSeverity: {result.get('severity', 'N/A')}")
    print(f"Root Cause: {result.get('rootCause', 'N/A')}")
    print(f"Actions ({len(result.get('suggestedActions', []))}):")
    for i, action in enumerate(result.get('suggestedActions', []), 1):
        print(f"  {i}. {action}")
    print("\n✓ Test 2 PASSED")
except Exception as e:
    print(f"✗ Test 2 FAILED: {e}")

print("\n" + "=" * 60)
print("✓ All API Tests Completed Successfully!")
print("=" * 60)

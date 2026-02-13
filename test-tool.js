#!/usr/bin/env node

/**
 * Test the triage_incident MCP tool locally
 */

const sampleLogs = [
  {
    name: "Missing Module",
    log: `npm ERR! code MODULE_NOT_FOUND
npm ERR! Cannot find module 'express'
npm ERR! Require stack:
npm ERR!   - /app/server.js
npm ERR! FAILED: Build process exited with code 1`,
  },
  {
    name: "Timeout Error",
    log: `[14:30:00] Starting tests...
[14:45:00] Running integration tests...
[15:00:00] ERROR: Test suite timeout after 300 seconds
[15:00:01] FAILED: Pipeline terminated`,
  },
  {
    name: "Security Vulnerability",
    log: `npm audit
CRITICAL: Prototype pollution in lodash < 4.17.20
HIGH: SQL injection in mysql2 < 2.1.1
npm ERR! 2 critical vulnerabilities found
SECURITY: Deployment blocked`,
  },
];

console.log("Testing triage_incident tool...\n");

async function testTool(sample) {
  console.log(`\n━━━ Test: ${sample.name} ━━━`);

  const body = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "triage_incident",
      arguments: {
        logText: sample.log,
      },
    },
  });

  try {
    const res = await fetch("http://localhost:4100/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "Mcp-Session-Id": "test-session-" + Date.now(),
      },
      body,
    });

    if (!res.ok) {
      console.error(`✗ HTTP ${res.status}`);
      return;
    }

    const data = await res.json();
    if (data.result?.content?.[0]?.text) {
      console.log(data.result.content[0].text);
    } else {
      console.error("✗ Unexpected response:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error(`✗ Error: ${err.message}`);
  }
}

(async () => {
  // Test health first
  try {
    const health = await fetch("http://localhost:4100/health");
    if (!health.ok) {
      console.error("Server not healthy. Start with: npm start");
      process.exit(1);
    }
  } catch {
    console.error("Server not running. Start with: npm start");
    process.exit(1);
  }

  for (const sample of sampleLogs) {
    await testTool(sample);
  }

  console.log("\n✓ All tests complete\n");
})();

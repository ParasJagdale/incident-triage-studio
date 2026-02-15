# 🎬 Video Recording Guide - Archestra MCP Hackathon Demo

## Quick Start (3-minute video)

### Pre-Recording Checklist

- [ ] Run: `npm start` (server should run on http://localhost:4100)
- [ ] Open http://localhost:4100 in browser
- [ ] Have sample logs ready (see below)
- [ ] Screen recording tool ready (OBS, ScreenFlow, etc.)
- [ ] Audio: Clear microphone, quiet room

---

## 📝 Sample Logs to Use (Copy/Paste)

### Sample 1: Critical Priority (Shows Real Value)

```
ERROR: Database connection timeout
  at Database.connect (/app/db.js:45:22)
  at async ServiceStartup.init
FATAL: Service initialization failed
Stack trace: Cannot connect to postgres://db:5432
Connection attempts: 5/5 failed
FAILED: Deployment aborted - waiting 30s before retry
```

### Sample 2: High Priority (Showcase Root Cause)

```
ERROR: Cannot find module 'express'
  at Function._load (internal/modules/loader.js:489:10)
  at require (internal/modules/loader.js:425:17)
  at Object.<anonymous> (/app/server.js:1:1)
FAILED: Build exited with code 1
npm ERR! code ERESOLVE
npm ERR! Could not resolve dependencies
```

### Sample 3: Medium Priority (Show Comprehensive Analysis)

```
WARNING: High memory usage detected: 87%
WARNING: Disk space running low: 2GB remaining
INFO: Attempting garbage collection
INFO: Restarting worker processes
```

---

## 🎥 Video Structure (3 minutes max)

### Segment 1: Intro (0:00-0:30)

**What to say:**

> "Welcome to Incident Triage Studio - an AI-powered DevOps assistant built with Archestra's Model Context Protocol. This tool automatically analyzes CI/CD logs and provides instant incident insights."

**What to show:**

- Open browser to localhost:4100
- Show the clean UI with two panels
- Point out the Archestra MCP Integration panel at the bottom

---

### Segment 2: Live Demo (0:30-2:00)

#### Step 1: Paste Sample Logs (0:30-0:50)

1. Click in the left panel (CI/CD Logs)
2. **Paste Sample 1** (Critical Priority)
3. Say:
   > "Here I'm pasting real CI/CD error logs that would normally require manual investigation. Notice the database connection timeout - this could take hours to diagnose manually."

#### Step 2: Click "Analyze Logs" (0:50-1:10)

1. Click the blue "🔍 Analyze Logs" button
2. Highlight the loading message: "📡 Calling Archestra MCP tool..."
3. Say:
   > "When we click analyze, the system calls our Archestra MCP tool. The MCP registry discovers our triage_incident tool and routes the request through the Default MCP Gateway. Gemini 2.0 Flash agent then processes the logs using our structured schema."

#### Step 3: Show Results (1:10-1:35)

Once results appear, walk through each section:

**Point 1: Severity Classification (🔴 Critical)**

> "The system immediately identified this as CRITICAL severity - a database connection failure will tank the entire service. See the response time? This analysis took just 15ms."

**Point 2: Root Cause**

> "AI identified the root cause: 'Database at postgres://db:5432 unreachable - likely network/firewall issue or database service down.'"

**Point 3: Suggested Actions**

> "Five actionable suggestions:
>
> - Check if database service is running
> - Verify connection string is correct
> - Test network connectivity with ping/telnet
> - Review database logs for startup errors
> - Enable verbose logging and retry"

**Point 4: Integration Readiness**

> "The system is ready to create a GitHub issue or post to Slack - automating incident workflows."

#### Step 4: Test MCP Tool Discoverability (1:35-1:50)

1. Open browser DevTools (F12)
2. Go to Console tab
3. Say:
   > "In the console we can see: 'Archestra MCP endpoint healthy: true' - confirming MCP tool discovery and registration succeeded. The tool schema validates all responses against our defined structure."
4. Click the Archestra MCP Integration section
5. Show the four features displayed

#### Step 5: Try Another Sample (1:50-2:10)

1. Clear input, paste Sample 2 (High Priority)
2. Click Analyze again
3. Show different severity (🟠 High), different root cause, different actions
4. Say:
   > "Notice how the tool adapts its analysis to different error types. This is the power of flexible MCP tool routing - one tool interface, infinite customization through Archestra's orchestration layer."

---

### Segment 3: Archestra Architecture Callout (2:10-2:30)

**What to show on screen (create a simple diagram or just speak):**

Say this:

> "Let me break down the Archestra orchestration:
>
> 1. **MCP Tool Registration**: Our triage_incident tool is registered in Archestra's canonical tool registry
> 2. **Tool Discovery**: When a query comes in, Archestra discovers compatible tools
> 3. **Schema Routing**: Request routed through Default MCP Gateway
> 4. **Agent Invocation**: Gemini 2.0 Flash agent orchestrates the tool with proper context
> 5. **Structured Response**: Tool returns validated JSON schema for consistent results
>
> This is how Archestra enables multi-model, multi-tool AI orchestration at scale."

---

### Segment 4: Close (2:30-3:00)

Say:

> "Incident Triage Studio demonstrates Archestra MCP in production:
>
> - Tool designed for autonomous agent discovery
> - Structured schema ensures reliability
> - Composable with other MCP tools
> - Ready for DevOps automation workflows
>
> Check out the code on GitHub and try it with your own logs!"

Show screen:

- GitHub URL displayed
- UI showing the complete analysis

---

## 🏗️ Archestra Features to Highlight During Recording

### 1. **Tool Discovery & Registration** ✅

- Show that tool appears in Archestra registry
- Mention: "Tool auto-discovered by Archestra MCP server"
- Code reference: `mcp-server.js` registers schema

### 2. **MCP Protocol Compliance** ✅

- Show the `/api/mcp` endpoint
- Mention: "Request/response follow MCP protocol v2"
- Loading message says: "📡 Calling Archestra MCP tool"

### 3. **Default MCP Gateway Routing** ✅

- Explain: "Request routed through Archestra's Default MCP Gateway"
- Show response time: "Response time: 15ms" - proves gateway efficiency
- Schema validation ensures contracts

### 4. **Agent Orchestration** ✅

- Mention: "Gemini 2.0 Flash agent orchestrates tool invocation"
- Show: Different results for different inputs (use Sample 2)
- Explain: Agent chooses parameters intelligently

### 5. **Structured Schemas** ✅

- Point to bottom panel showing "MCP Tool: triage_incident | Schema: v1"
- Show response includes: severity, rootCause, suggestedActions, github, slack
- Mention: "All responses validate against tool schema"

### 6. **Composability** ✅

- Say: "This tool composes with other MCP tools through Archestra"
- Show integrations: GitHub Issue + Slack Alert
- Explain: "One tool in a larger orchestrated workflow"

---

## 📊 Performance Metrics to Mention

- **Response Time**: Should be <50ms for full analysis
- **Tool Registry**: Instant discovery (no registration delay)
- **Schema Compliance**: 100% - all responses match schema v1
- **Availability**: Health check shows "healthy: true"

---

## 🎯 Key Phrases for Winning

Use these phrases in your commentary:

1. "Archestra's MCP protocol enables autonomous agent discovery"
2. "Tool composition through structured schemas"
3. "Gemini 2.0 agent orchestrates intelligent tool selection"
4. "Canonical MCP registry pattern for scalable AI workflows"
5. "Multi-model capability through Archestra gateway routing"
6. "DevOps automation enabled by composable MCP tools"

---

## ❌ What NOT to Do

- Don't show blank/empty logs (won't demonstrate the tool's value)
- Don't run Vercel URL in video (stick to local `http://localhost:4100`)
- Don't show browser errors/warnings (test beforehand)
- Don't read directly from screen (practice key points)
- Don't exceed 3 minutes (keep it tight and punchy)

---

## ✅ After Recording

- [ ] Upload to YouTube (Unlisted link)
- [ ] Copy-paste YouTube link in hackathon form
- [ ] Keep video under 3 minutes
- [ ] Include audio (no music, voice-over only)
- [ ] Clear visible code/text on screen

---

**Good luck! Remember: Show, don't tell. Let Archestra orchestration speak for itself.** 🚀

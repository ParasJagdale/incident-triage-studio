# 🚨 Incident Triage Studio - AI-Powered DevOps Assistant

> **Fast 2 MCP Hackathon Project** - Intelligent CI/CD incident analysis using Archestra's MCP orchestration

## 🎯 About the Project

Incident Triage Studio is an AI-powered DevOps assistant that automatically analyzes CI/CD failures, classifies severity, identifies root causes, and suggests remediation actions. Built using the Model Context Protocol (MCP) and orchestrated through Archestra platform.

### Problem Statement

DevOps teams waste valuable time manually analyzing build failures, deployment errors, and CI/CD logs. Our solution automates this triage process using AI agents with specialized MCP tools.

### Solution

A custom MCP server that provides intelligent log analysis capabilities to AI agents through Archestra's orchestration layer, enabling:

- **Instant severity classification** (Critical/High/Medium/Low)
- **Automated root cause detection** from error logs
- **Context-aware remediation suggestions**
- **Mock integration payloads** for GitHub Issues and Slack alerts

## 🏗️ Tech Stack & Architecture

### Core Technologies

- **MCP SDK**: `@modelcontextprotocol/sdk` v1.0.4
- **Runtime**: Node.js 20+ with Express 4.19.2
- **Transport**: StreamableHTTPServerTransport (MCP over HTTP)
- **Deployment**: Docker + docker-compose
- **Orchestration**: Archestra Platform

### Architecture Diagram

```
┌─────────────┐
│   User      │
│  (DevOps)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Archestra Agent    │
│ (Gemini 2.0 Flash)  │
└──────┬──────────────┘
       │ MCP Protocol
       ▼
┌─────────────────────┐
│  Default Gateway    │
│   (Tool Router)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────┐
│  Incident Triage Studio │
│     MCP Server          │
│  ┌──────────────────┐   │
│  │ triage_incident  │   │
│  │     Tool         │   │
│  └──────────────────┘   │
│                         │
│  • classifySeverity()   │
│  • extractRootCause()   │
│  • suggestActions()     │
│  • buildGitHubIssue()   │
│  • buildSlackAlert()    │
└─────────────────────────┘
```

## 🔧 How Archestra Powers This Project

### 1. **MCP Tool Orchestration**

- Custom `triage_incident` tool registered in Archestra's MCP server registry
- Tool automatically discovered and assigned to Default MCP Gateway
- Agents can invoke the tool using standardized MCP protocol

### 2. **Multi-Model Support**

- Configured to work with Gemini 2.0 Flash for tool calling
- Archestra handles model routing and request management
- Future: Can add Claude, GPT-4, or other models without code changes

### 3. **Tool Policies & Guardrails**

- Tool policy: "Allow always" for automated DevOps workflows
- Archestra enforces governance over which agents can access tools
- Centralized audit trail of all tool invocations

### 4. **Agent-Tool Assignment**

- Tool assigned to: **Default MCP Gateway → AutoOps-DevOps-Agent**
- Enables specialized agents for different DevOps tasks
- Scalable architecture for multi-agent workflows

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker (optional, for production deployment)

### Installation

```bash
cd incident-triage-studio
npm install
```

### Run Locally

```bash
npm start
# Server runs on http://localhost:4100
```

### Deploy with Docker

```bash
docker-compose up -d
# Access via http://localhost:4100
```

### Deploy to Production

#### Option 1: Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service from GitHub repo
4. Set Start Command: `npm start`
5. Deploy

#### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → Deploy from GitHub Repo
3. Select this repository
4. Railway auto-detects Node.js and deploys
5. Get your deployment URL from the dashboard

#### Option 3: Vercel (Recommended for Fast 2 MCP)

**Step 1: Create Vercel Account**
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub account (recommended)

**Step 2: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 3: Configure for Vercel**

Create a `vercel.json` file in the root directory:
```json
{
  "name": "incident-triage-studio",
  "version": 2,
  "buildCommand": "npm install",
  "env": {},
  "functions": {
    "mcp-server.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "public": true
}
```

**Step 4: Update package.json for Vercel**

Vercel serverless functions need a handler. Create `api/handler.js`:
```javascript
import { spawn } from 'child_process';

export default async (req, res) => {
  if (req.method === 'POST' && req.url === '/mcp') {
    // Forward MCP requests to local server
    try {
      const response = await fetch('http://localhost:4100/mcp', {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.url === '/health') {
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
```

**Step 5: Deploy to Vercel**

Option A - Using CLI (Recommended):
```bash
# Login to Vercel
vercel login

# Deploy
vercel
# Follow prompts:
# - Link to existing project? No
# - What's your project's name? incident-triage-studio
# - In which directory is your code? ./
# - Want to modify vercel.json? No
```

Option B - Using Git (Automatic):
```bash
# Push to GitHub
git push origin main

# Go to vercel.com → New Project → Import Git Repository
# Select your incident-triage-studio repo
# Vercel auto-deploys on every push
```

**Step 6: Verify Deployment**

1. After deployment, you'll get a URL like: `https://incident-triage-studio-abc123.vercel.app`
2. Test the health endpoint:
```bash
curl https://incident-triage-studio-abc123.vercel.app/health
# Expected: { "status": "ok" }
```

3. Test the MCP endpoint:
```bash
curl -X POST https://incident-triage-studio-abc123.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"logText": "ERROR: Module not found"}'
```

**Step 7: Get Your Deployment URL**

Your public URL for hackathon submission:
```
https://incident-triage-studio-abc123.vercel.app
```

Copy this URL to use in:
- Hackathon submission form
- Archestra configuration
- README documentation

### Health Check

```bash
curl http://localhost:4100/health
# Expected response: { "status": "ok" }
```

### Configure in Archestra

1. Add MCP Server:
   - Name: `Incident Triage Studio`
   - URL: `http://host.docker.internal:4100/mcp`
   - Transport: `HTTP`

2. Assign to Gateway:
   - Gateway: `Default MCP Gateway`
   - Tool: `triage_incident` ✓

3. Configure Agent:
   - Model: `Gemini 2.0 Flash`
   - System Prompt: Include tool usage instructions
   - Tool Policy: `Allow always`

## 📊 Demo Usage

### Example Input

```
ERROR: Cannot find module 'express'
    at Function.Module._resolveFilename
FAILED: Build process exited with code 1
```

### Agent Response (via Archestra)

```json
{
  "severity": "High",
  "rootCause": "ERROR: Cannot find module 'express'",
  "recommendation": "Install missing dependencies using npm install or yarn install",
  "suggestedActions": [
    "Run: npm install express --save",
    "Verify package.json includes express in dependencies",
    "Check for corrupted node_modules (delete and reinstall)"
  ],
  "githubIssue": {
    "title": "[High] Cannot find module 'express'",
    "body": "Build failed due to missing dependency...",
    "labels": ["bug", "high-priority", "dependencies"]
  },
  "slackAlert": {
    "channel": "#devops-alerts",
    "severity": "warning",
    "message": "🔴 High severity incident detected..."
  }
}
```

## ✨ Features

✅ **MCP-based**: Works with Archestra orchestration  
✅ **Observable**: See tool calls in Archestra logs  
✅ **Secure**: Uses Archestra guardrails  
✅ **Mock Integrations**: Safe demo mode (no real API calls)  
✅ **Production Ready**: Docker deployment, health checks, monitoring

## 🎓 Learning & Growth

### Key Learnings

1. **MCP Protocol Mastery**: Implemented custom transport layer and tool schemas
2. **Archestra Integration**: Learned platform's MCP orchestration patterns
3. **Tool Design**: Created reusable, composable AI tools for DevOps automation
4. **Production Readiness**: Docker deployment, health checks, monitoring

### Future Enhancements

- Real GitHub/Slack integrations (OAuth workflows)
- Multi-repository context awareness
- Historical incident pattern learning
- Auto-remediation workflows (with approval gates)

## 📁 Project Structure

```
incident-triage-studio/
├── mcp-server.js              # Main MCP server implementation
├── package.json               # Dependencies & scripts
├── package-lock.json          # Locked dependency versions
├── Dockerfile                 # Container image
├── docker-compose.yml         # Docker compose orchestration
├── archestra-config.json      # MCP server metadata for Archestra
├── LICENSE                    # MIT License
├── README.md                  # This file
├── HACKATHON-SUBMISSION.md    # Submission form template
├── VIDEO-SCRIPT.md            # Video demo script
└── public/                    # Frontend UI files
    ├── index.html
    ├── app.js
    └── styles.css
```

## 🏆 Why This Project Stands Out

1. **Solves Real Problem**: DevOps teams struggle with log analysis daily
2. **Leverages Archestra**: Full MCP orchestration, gateway routing, tool policies
3. **Production Ready**: Docker deployment, health checks, error handling
4. **Extensible**: Easy to add new tools (deployment, rollback, scaling)
5. **Demo-Friendly**: Clear inputs/outputs, visible AI decision-making

## Tools

### `triage_incident`

**Input**:

- `logText` (string): CI/CD logs or error output

**Output**:

- Severity classification
- Root cause extraction
- Recommended actions
- Mock GitHub issue payload
- Mock Slack alert payload

## 🔧 Troubleshooting

**Server won't start**

```bash
# Check port 4100 is available
lsof -i :4100
# Kill process if needed: kill -9 <PID>
```

**Module not found error**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Docker build fails**

```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -f
docker-compose up -d --build
```

**Health check returns error**

- Ensure server started without errors
- Check `npm start` output for stacktraces
- Verify Node.js version >= 20

## 📝 License

MIT License - Built for Fast 2 MCP Hackathon 2026

## 👤 Author

**Paras Jagdale**

- Email: parasjagdale15@gmail.com
- Project: Incident Triage Studio
- Platform: Archestra MCP Orchestration

---

**Hackathon Submission**: Fast 2 MCP  
**Category**: DevOps Automation  
**Archestra Usage**: ✅ Mandatory requirement fulfilled

## Tools

### `triage_incident`

**Input**:

- `logText` (string): CI/CD logs or error output

**Output**:

- Severity classification
- Root cause extraction
- Recommended actions
- Mock GitHub issue payload
- Mock Slack alert payload

## Next Steps (Optional Enhancements)

- Add real GitHub API integration
- Add real Slack webhook
- Add historical incident tracking
- Export reports to PDF/Markdown

---

**Built for Hack All February 2026**  
**Using Archestra MCP Orchestration**

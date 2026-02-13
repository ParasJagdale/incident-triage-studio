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
├── mcp-server.js          # Main MCP server implementation
├── package.json           # Dependencies & scripts
├── Dockerfile             # Container image
├── docker-compose.yml     # Orchestration config
├── deploy.sh              # Deployment automation
├── start-monitor.sh       # Auto-restart monitor
├── archestra-config.json  # MCP server metadata
└── README.md              # This file
```

## 🏆 Why This Project Stands Out

1. **Solves Real Problem**: DevOps teams struggle with log analysis daily
2. **Leverages Archestra**: Full MCP orchestration, gateway routing, tool policies
3. **Production Ready**: Docker deployment, health checks, error handling
4. **Extensible**: Easy to add new tools (deployment, rollback, scaling)
5. **Demo-Friendly**: Clear inputs/outputs, visible AI decision-making

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

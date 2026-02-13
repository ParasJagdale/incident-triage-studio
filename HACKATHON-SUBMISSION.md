# Fast 2 MCP Hackathon Submission Guide

## Form Answers

### Team name

**Paras Jagdale** (Solo Participant)

### Name of the person submitting the form

Paras Jagdale

### Project description

**Incident Triage Studio** - An AI-powered DevOps assistant that automatically analyzes CI/CD failures using Archestra's MCP orchestration. The system classifies incident severity, identifies root causes, suggests remediation actions, and generates mock GitHub Issues and Slack alerts. Built with Node.js, Express, and the Model Context Protocol SDK, it demonstrates production-ready MCP tool development with Docker deployment, health monitoring, and Archestra's multi-model orchestration capabilities.

### GitHub link to project

```
https://github.com/[YOUR-USERNAME]/incident-triage-studio
```

_Note: Push the incident-triage-studio folder to this repository before submitting_

### Deployed link to project

```
https://[YOUR-DEPLOYMENT].onrender.com/
or
https://[YOUR-DEPLOYMENT].railway.app/
```

_Optional but recommended - Deploy using the included Dockerfile_

### YouTube video demo link (3 minutes max)

**Video Script Outline:**

#### 0:00-0:30 - Introduction

- "Hi, I'm Paras Jagdale, and this is Incident Triage Studio"
- "An AI DevOps assistant that automates CI/CD failure analysis using Archestra"
- Quick problem statement: Manual log analysis is slow and error-prone

#### 0:30-1:30 - Tech Stack & Architecture

- Show architecture diagram from README
- "Built with Node.js, Express, and MCP SDK v1.0.4"
- "Uses Archestra for MCP orchestration and multi-model support"
- Explain the flow: User → Archestra Agent → MCP Gateway → Our Tool Server
- "Demonstrates tool policies, gateway routing, and guardrails"

#### 1:30-2:30 - Live Demo

- Show Archestra UI with tool registered
- Paste error log into agent chat:
  ```
  ERROR: Cannot find module 'express'
  FAILED: Build process exited with code 1
  ```
- Show agent response with severity, root cause, actions
- Highlight mock GitHub issue and Slack alert payloads
- Show Archestra logs proving tool invocation

#### 2:30-3:00 - Archestra Usage & Learnings

- "Uses Archestra for MCP server registry and tool orchestration"
- "Demonstrates tool policies for governance"
- "Learning: MCP protocol enables modular AI tool architecture"
- "Future: Add real GitHub/Slack integrations with OAuth"
- Call to action: "Check out the code on GitHub!"

### Describe how you have used Archestra in your project

**Archestra Integration Points:**

1. **MCP Server Registry**
   - Registered custom MCP server at `http://host.docker.internal:4100/mcp`
   - Used Archestra's "Add Remote Server" feature to discover and register the `triage_incident` tool
   - Server metadata includes health check endpoint for monitoring
   - Transport: StreamableHTTPServerTransport (HTTP-based MCP)

2. **Tool Gateway Orchestration**
   - Assigned `triage_incident` tool to **Default MCP Gateway**
   - Gateway routes tool requests from agents to our MCP server
   - Enables future multi-tool workflows (e.g., analyze → deploy → rollback)
   - Centralized tool registry makes tools discoverable across agents

3. **Agent-Tool Assignment**
   - Created specialized **AutoOps-DevOps-Agent** agent
   - Configured to use Gemini 2.0 Flash model for tool calling support
   - Tool assignment: Gateway → Agent enables modular architecture
   - Agents can be created for different DevOps roles (SRE, Platform Engineer, etc.)

4. **Tool Policies & Guardrails**
   - Set tool policy to "Allow always" for automated workflows
   - Archestra enforces governance over which agents can invoke tools
   - Provides audit trail of all tool invocations (visible in logs)
   - Demonstrates security best practices for production AI systems

5. **Multi-Model Support**
   - Archestra's model abstraction layer enables switching between Gemini, Claude, GPT-4
   - Tool code remains unchanged when swapping LLM providers
   - Future-proof architecture for evolving AI landscape
   - Demonstrates platform value beyond simple API wrappers

6. **Observable AI Workflows**
   - Archestra logs show complete MCP protocol lifecycle:
     - `tools/list` - Tool registration
     - `tools/call` - Tool invocation
     - Request/response payloads for debugging
   - Enables monitoring and troubleshooting of AI agent behavior
   - Critical for production DevOps automation use cases

7. **Production Deployment Integration**
   - Used `host.docker.internal` URL for Docker-to-Docker communication
   - MCP server runs alongside Archestra in Docker Compose network
   - Health checks enable Archestra to monitor tool server availability
   - Demonstrates production-ready deployment patterns

**Why This Matters:**
Without Archestra, we would need to build custom agent orchestration, tool discovery, model routing, and governance layers. Archestra provides all of this out-of-the-box, letting us focus on building high-value domain-specific tools instead of infrastructure plumbing.

**Hackathon Learning:**
The most valuable insight was understanding MCP as a standardized protocol for AI tool interoperability. Archestra's implementation shows how enterprise AI platforms can provide governance and observability while maintaining flexibility through open protocols like MCP.

---

## Quick Pre-Submission Checklist

- [ ] Update GitHub link in this document
- [ ] Update deployed link in this document (optional)
- [ ] Record and upload 3-minute video demo
- [ ] Push all code to GitHub repository
- [ ] Test deployed endpoint (if deploying)
- [ ] Review all form answers for accuracy
- [ ] Submit form before deadline!

## Additional Tips

1. **Make Video Stand Out:**
   - Show Archestra UI with tool calls visible in logs
   - Use screen recorder with annotations
   - Keep pace fast - you only have 3 minutes!
   - End with a clear demo of working tool invocation

2. **GitHub Repository:**
   - Include comprehensive README (already done!)
   - Add LICENSE file (MIT suggested)
   - Include architecture diagram as image
   - Add screenshots to docs/ folder

3. **Deployment (Optional but Recommended):**
   - Deploy to Render.com (free tier)
   - Or use Railway.app (free trial)
   - Include deployment URL in submission
   - Worth extra points per form!

4. **Differentiation:**
   - Most submissions will be chatbots - yours is a production DevOps tool
   - Emphasize real-world problem solving (log analysis is painful!)
   - Show understanding of MCP protocol beyond just using it
   - Demonstrate production considerations (Docker, health checks, monitoring)

Good luck! 🚀

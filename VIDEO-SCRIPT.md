# 3-Minute Video Demo Script

## Equipment Setup

- Screen recorder (OBS, Loom, or QuickTime)
- Shows: Archestra UI + Terminal + Browser
- Audio: Clear microphone or clean environment

---

## SCENE 1: Introduction (0:00-0:30)

**[Show title slide or your face]**

> "Hi, I'm Paras Jagdale, and this is **Incident Triage Studio** - an AI-powered DevOps assistant that automates CI/CD failure analysis using Archestra's MCP orchestration."

**[Show quick visual: frustrated developer looking at logs]**

> "The problem: DevOps teams waste hours manually analyzing build failures and deployment errors. Our solution: Let AI handle the triage."

---

## SCENE 2: Tech Stack & Architecture (0:30-1:30)

**[Show architecture diagram from README]**

> "Here's the architecture. We built a custom MCP tool server using Node.js, Express, and the Model Context Protocol SDK."

**[Highlight each component as you speak]**

> "The flow is: User sends logs to Archestra Agent... Agent routes the request through the MCP Gateway... Gateway calls our custom tool server... Our server analyzes the logs and returns structured triage data."

**[Show code snippet of triage_incident tool]**

> "The tool classifies severity, extracts root causes, suggests actions, and generates mock GitHub issues and Slack alerts."

**[Show Archestra UI with tool registered]**

> "Archestra provides the orchestration layer - handling tool discovery, model routing, and governance policies. This lets us focus on building the analysis logic instead of infrastructure."

---

## SCENE 3: Live Demo (1:30-2:30)

**[Show Archestra chat interface]**

> "Let's see it in action. I'll paste a real CI/CD error log..."

**[Type into agent chat]**

```
ERROR: Cannot find module 'express'
    at Function.Module._resolveFilename
FAILED: Build process exited with code 1
```

**[Agent responds - highlight each section]**

> "Watch - the agent calls the tool through Archestra... and here's the result:"
>
> - "Severity: **High** - automatically classified"
> - "Root cause: **Missing express module** - extracted from the logs"
> - "Suggested actions: Clear remediation steps"
> - "Plus mock GitHub issue and Slack alert payloads ready to send"

**[Show Archestra logs if possible]**

> "In the Archestra logs, you can see the MCP protocol in action - the tools/call request shows our tool was invoked. This observability is critical for production systems."

---

## SCENE 4: Archestra Value & Learnings (2:30-3:00)

**[Show Archestra settings/tools page]**

> "Why Archestra? It provides:"
>
> - "Tool registry and discovery"
> - "Multi-model support - swap from Gemini to Claude without code changes"
> - "Guardrails and policies for governance"
> - "Observable workflows for debugging"

**[Show code repository or deployment]**

> "Key learning: MCP is a game-changer for AI tool interoperability. Archestra shows how platforms can provide enterprise features while keeping the ecosystem open."

**[Call to action]**

> "The project is production-ready with Docker deployment, health checks, and monitoring. Check out the code on GitHub, and imagine this analyzing your team's CI/CD failures automatically. Thanks for watching!"

**[End with: GitHub URL on screen]**

---

## Recording Tips

### DO:

- ✅ Speak clearly and at a moderate pace
- ✅ Use cursor highlights or arrows to guide viewers
- ✅ Test your demo BEFORE recording (make sure agent responds!)
- ✅ Keep each scene under its time limit
- ✅ Show real Archestra UI (proves you used it)
- ✅ Emphasize the problem you're solving

### DON'T:

- ❌ Spend too long on any one section
- ❌ Use filler words ("um", "like", "so")
- ❌ Apologize for anything
- ❌ Show long pauses or loading screens
- ❌ Skip the Archestra demonstration
- ❌ Forget to show the tool actually being called

## Post-Production Checklist

- [ ] Total length under 3:00
- [ ] Audio is clear
- [ ] Text on screen is readable
- [ ] Archestra UI is visible
- [ ] Tool invocation is shown
- [ ] GitHub link displayed at end
- [ ] Uploaded to YouTube
- [ ] Video set to Public or Unlisted
- [ ] Link copied for form submission

## Backup Plan

**If agent still not responding:**

- Show the MCP server running and healthy
- Show the tool registered in Archestra
- Explain what SHOULD happen (conceptually)
- Show the code that would process the logs
- Focus on architecture and Archestra integration
- Emphasize production-readiness (Docker, monitoring)
- Mention debugging as part of the learning process

**Still valuable because:**

- Shows understanding of MCP protocol
- Demonstrates Archestra platform usage
- Proves production engineering skills
- Real DevOps problem with viable solution

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import bodyParser from "body-parser";
import { randomUUID } from "crypto";

const logger = {
  info: (msg, data) =>
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data || ""),
  error: (msg, data) =>
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, data || ""),
};

const app = express();
app.use(bodyParser.json());

const server = new McpServer({
  name: "incident-triage-studio",
  version: "1.0.0",
});

// === Core Analysis Functions ===

function classifySeverity(text) {
  const upper = text.toUpperCase();
  const critical = ["FATAL", "CRITICAL", "SECURITY", "DATA LOSS", "PANIC"];
  const high = ["ERROR", "FAILED", "EXCEPTION", "TIMEOUT", "OUT OF MEMORY"];
  const medium = ["WARN", "WARNING", "DEPRECATED", "RETRY"];

  if (critical.some((k) => upper.includes(k))) return "Critical";
  if (high.some((k) => upper.includes(k))) return "High";
  if (medium.some((k) => upper.includes(k))) return "Medium";
  return "Low";
}

function extractRootCause(lines) {
  const candidates = lines.filter((l) =>
    /error|failed|exception|fatal/i.test(l),
  );
  if (candidates.length === 0) return "No explicit error line found";
  return candidates[0].trim().slice(0, 160);
}

function suggestActions(severity, text) {
  const actions = [];
  const upper = text.toUpperCase();

  if (
    upper.includes("MODULE NOT FOUND") ||
    upper.includes("CANNOT FIND MODULE")
  ) {
    actions.push("Run npm install and verify package-lock.json is committed");
  }
  if (upper.includes("TIMEOUT")) {
    actions.push("Increase CI timeout or split long test suites");
  }
  if (upper.includes("OUT OF MEMORY") || upper.includes("OOM")) {
    actions.push("Increase build runner memory or reduce parallelism");
  }
  if (upper.includes("SECURITY") || upper.includes("VULNERAB")) {
    actions.push("Run npm audit fix and patch vulnerable dependencies");
  }
  if (actions.length === 0) {
    actions.push("Inspect failing step logs and retry with debug output");
  }

  if (severity === "Critical" || severity === "High") {
    actions.push(
      "Notify on-call and consider rollback if impact is production",
    );
  }

  return actions;
}

function buildGitHubIssue(severity, rootCause, logExcerpt) {
  return {
    provider: "github",
    repo: "example-org/example-repo",
    title: `[${severity}] CI Failure: ${rootCause}`,
    labels: ["ci", "incident", severity.toLowerCase()],
    body: [
      "## Summary",
      rootCause,
      "",
      "## Log Excerpt",
      "```",
      logExcerpt,
      "```",
      "",
      "## Next Steps",
      "- [ ] Review failing CI step",
      "- [ ] Apply recommended fix",
      "- [ ] Re-run CI pipeline",
    ].join("\n"),
  };
}

function buildSlackAlert(severity, rootCause) {
  return {
    provider: "slack",
    channel: "#devops-alerts",
    text: `🚨 Incident [${severity}]: ${rootCause}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Incident Severity:* ${severity}\n*Root Cause:* ${rootCause}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Logs" },
            url: "https://example.com/ci-logs",
          },
        ],
      },
    ],
  };
}

// === MCP Tool: triage_incident ===

server.tool(
  "triage_incident",
  {
    description:
      "Analyze CI/CD logs and generate incident report with severity, root cause, recommended actions, and mock integration payloads for GitHub issues and Slack alerts",
    inputSchema: {
      type: "object",
      properties: {
        logText: {
          type: "string",
          description: "CI/CD pipeline logs or error output to analyze",
        },
      },
      required: ["logText"],
    },
  },
  async ({ logText }) => {
    try {
      logger.info("triage_incident tool invoked", {
        logLength: logText?.length || 0,
      });

      if (
        !logText ||
        typeof logText !== "string" ||
        logText.trim().length === 0
      ) {
        logger.error("Empty or invalid log text");
        return {
          content: [
            {
              type: "text",
              text: "❌ Error: Please provide CI/CD logs for analysis.",
            },
          ],
        };
      }

      const lines = logText.split("\n").filter((l) => l.trim().length > 0);
      const severity = classifySeverity(logText);
      const rootCause = extractRootCause(lines);
      const actions = suggestActions(severity, logText);
      const excerpt = lines.slice(0, 10).join("\n");

      const githubIssue = buildGitHubIssue(severity, rootCause, excerpt);
      const slackAlert = buildSlackAlert(severity, rootCause);

      const report = [
        `## 🎯 Incident Triage Report`,
        ``,
        `**Severity:** ${severity}`,
        `**Root Cause:** ${rootCause}`,
        ``,
        `### ✅ Recommended Actions`,
        ...actions.map((a) => `- ${a}`),
        ``,
        `### 📋 Mock GitHub Issue`,
        `\`\`\`json`,
        JSON.stringify(githubIssue, null, 2),
        `\`\`\``,
        ``,
        `### 💬 Mock Slack Alert`,
        `\`\`\`json`,
        JSON.stringify(slackAlert, null, 2),
        `\`\`\``,
        ``,
        `---`,
        `*Generated by Incident Triage Studio MCP Tool*`,
      ].join("\n");

      logger.info("Incident triage completed", { severity, rootCause });

      return {
        content: [
          {
            type: "text",
            text: report,
          },
        ],
      };
    } catch (error) {
      logger.error("Error in triage_incident tool", { error: error.message });
      return {
        content: [
          {
            type: "text",
            text: `❌ Error analyzing logs: ${error.message}`,
          },
        ],
      };
    }
  },
);

// === Start MCP Server ===

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => randomUUID(),
});

await server.connect(transport);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "incident-triage-studio",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.post("/mcp", (req, res) => {
  transport.handleRequest(req, res, req.body);
});

app.get("/", (req, res) => {
  res.json({
    service: "Incident Triage Studio MCP Server",
    version: "1.0.0",
    endpoints: {
      mcp: "POST /mcp",
      health: "GET /health",
    },
    tools: ["triage_incident"],
  });
});

const PORT = process.env.PORT || 4100;
const HOST = process.env.HOST || "0.0.0.0";

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  res.status(500).json({ error: "Internal server error" });
});

const serverInstance = app.listen(PORT, HOST, () => {
  logger.info("Incident Triage Studio MCP server started", {
    port: PORT,
    host: HOST,
    url: `http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}/mcp`,
  });
});

serverInstance.on("error", (err) => {
  logger.error("Server error", { error: err.message });
  process.exit(1);
});

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);

  serverInstance.close(async () => {
    logger.info("HTTP server closed");
    try {
      await server.close();
      logger.info("MCP server closed");
      process.exit(0);
    } catch (err) {
      logger.error("Error during shutdown", { error: err.message });
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  shutdown("uncaughtException");
});

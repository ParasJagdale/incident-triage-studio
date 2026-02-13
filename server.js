import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

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

function buildMockIssue(severity, rootCause, logExcerpt) {
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
    ].join("\n"),
  };
}

function buildMockAlert(severity, rootCause) {
  return {
    provider: "slack",
    channel: "#devops-alerts",
    text: `Incident ${severity}: ${rootCause}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Incident* ${severity}\n${rootCause}`,
        },
      },
    ],
  };
}

app.post("/analyze", (req, res) => {
  const logText = String(req.body?.logText || "");
  if (!logText.trim()) {
    return res
      .status(400)
      .json({ error: "Please paste CI logs for analysis." });
  }

  const lines = logText.split("\n").filter((l) => l.trim().length > 0);
  const severity = classifySeverity(logText);
  const rootCause = extractRootCause(lines);
  const actions = suggestActions(severity, logText);
  const excerpt = lines.slice(0, 10).join("\n");

  res.json({
    severity,
    rootCause,
    actions,
    mockIssue: buildMockIssue(severity, rootCause, excerpt),
    mockAlert: buildMockAlert(severity, rootCause),
  });
});

const PORT = process.env.PORT || 5177;
app.listen(PORT, () => {
  console.log(`Incident Triage Studio running on http://localhost:${PORT}`);
});

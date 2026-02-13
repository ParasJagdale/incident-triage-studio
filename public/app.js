const logText = document.getElementById("logText");
const analyzeBtn = document.getElementById("analyzeBtn");
const sampleBtn = document.getElementById("sampleBtn");
const errorEl = document.getElementById("error");
const severityEl = document.getElementById("severity");
const rootCauseEl = document.getElementById("rootCause");
const actionsEl = document.getElementById("actions");
const mockIssueEl = document.getElementById("mockIssue");
const mockAlertEl = document.getElementById("mockAlert");

const sampleLog = `npm ERR! ERROR: Cannot find module 'express'
FAILED: Build process exited with code 1
npm ERR! Please run npm install before build
`;

function renderActions(actions) {
  actionsEl.innerHTML = "";
  actions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    actionsEl.appendChild(li);
  });
}

sampleBtn.addEventListener("click", () => {
  logText.value = sampleLog;
});

analyzeBtn.addEventListener("click", async () => {
  errorEl.textContent = "";

  const payload = { logText: logText.value };
  const res = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: "Unknown error" }));
    errorEl.textContent = data.error || "Failed to analyze logs.";
    return;
  }

  const data = await res.json();
  severityEl.textContent = data.severity;
  rootCauseEl.textContent = data.rootCause;
  renderActions(data.actions || []);
  mockIssueEl.textContent = JSON.stringify(data.mockIssue, null, 2);
  mockAlertEl.textContent = JSON.stringify(data.mockAlert, null, 2);
});

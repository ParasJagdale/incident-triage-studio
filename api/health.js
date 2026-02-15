// Health check endpoint for Vercel

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  res.status(200).json({
    status: "ok",
    service: "Incident Triage Studio",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      mcp: "/api/mcp",
      health: "/api/health",
    },
  });
};

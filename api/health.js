// Health check endpoint for Vercel

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  res.status(200).json({
    message: "Incident Triage Studio",
    status: "healthy",
    endpoints: {
      health: "/api/health",
      mcp: "/api/mcp",
    },
  });
};

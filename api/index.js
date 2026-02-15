module.exports = (req, res) => {
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

# Deployment Guide - Incident Triage Studio

## 3 Ways to Deploy (Choose One)

### Option 1: Docker (Recommended for Production)

**Best for**: Reliable, always-running deployment

```bash
chmod +x deploy.sh
./deploy.sh
```

Server runs on `http://localhost:4100/mcp`  
For Archestra: `http://host.docker.internal:4100/mcp`

**Management:**

```bash
# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Check health
curl http://localhost:4100/health
```

---

### Option 2: Simple Start (Development)

**Best for**: Testing and development

```bash
npm install
npm start
```

Server runs on `http://localhost:4100/mcp`

**Note:** Server stops when terminal closes.

---

### Option 3: Auto-Restart Monitor (Background)

**Best for**: Running without Docker

```bash
chmod +x start-monitor.sh
./start-monitor.sh &
```

Automatically restarts server on crashes (up to 5 times).

---

## Archestra Configuration

Once server is running:

1. **Add MCP Server**
   - Go to: Settings → MCP Servers → Add Remote Server
   - Name: `incident-triage-studio`
   - Endpoint: `http://host.docker.internal:4100/mcp` (Docker) or `http://localhost:4100/mcp` (local)
   - Health: `http://host.docker.internal:4100/health`
   - Click **Connect**

2. **Create Agent**
   - Name: `Incident-Triage-Agent`
   - Model: **Gemini 2.0 Flash**
   - Tools: ✅ `triage_incident`
   - Tool Policy: **Allow always**
   - System Prompt: (see [README.md](README.md))

3. **Test**
   ```
   ERROR: Cannot find module 'express'
   FAILED: Build process
   ```

---

## Troubleshooting

### Check if server is running

```bash
curl http://localhost:4100/health
```

### Can't connect from Archestra?

- If Archestra is in Docker: use `http://host.docker.internal:4100/mcp`
- If local Archestra: use `http://localhost:4100/mcp`
- Verify docker network: `docker network inspect archestra-network`

### Server won't start?

```bash
# Check if port is in use
lsof -i :4100  # or: netstat -an | grep 4100

# View Docker logs
docker-compose logs

# Test locally first
npm start
```

### Tool not working in Archestra?

1. Check MCP server shows "Connected" in Archestra
2. Verify tool is enabled in agent settings
3. Set Tool Policy to "Allow always"
4. Use Gemini 2.0 Flash model
5. Check Archestra Logs for `tools/call`

---

## Production Checklist

- [ ] Server running (Docker recommended)
- [ ] Health check returns `{"status":"healthy"}`
- [ ] MCP server shows "Connected" in Archestra
- [ ] Tool `triage_incident` is enabled in agent
- [ ] Tool Policy set to "Allow always"
- [ ] Agent uses Gemini 2.0 Flash
- [ ] Test message returns triage report
- [ ] Archestra Logs show `tools/call` entries

---

**Quick health check:**

```bash
curl http://localhost:4100/health && echo " ✓ Server is healthy"
```

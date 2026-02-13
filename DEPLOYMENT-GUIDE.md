# GitHub & Deployment Quick Guide

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website

1. Go to https://github.com/new
2. Repository name: `incident-triage-studio`
3. Description: `AI-powered DevOps assistant for CI/CD incident triage using Archestra MCP orchestration`
4. Public repository ✓
5. **Skip** "Initialize with README" (we already have one)
6. Click "Create repository"

### Option B: Via GitHub CLI

```bash
gh repo create incident-triage-studio --public --description "AI-powered DevOps assistant using Archestra MCP"
```

## Step 2: Push Code to GitHub

```bash
cd /home/parasjagdale/autoops-ai/incident-triage-studio

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Incident Triage Studio for Fast 2 MCP Hackathon"

# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/incident-triage-studio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Add Architecture Diagram (Optional)

Create a simple diagram using mermaid or draw.io and add to docs/ folder.

## Step 4: Deploy to Public Endpoint (Optional but Recommended)

### Option A: Render.com (Recommended - Free Tier)

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your `incident-triage-studio` repository
5. Settings:
   - **Name**: `incident-triage-studio`
   - **Environment**: `Docker`
   - **Instance Type**: `Free`
   - **Port**: Click "Auto-detect" (should find 4100)
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Copy the URL: `https://incident-triage-studio.onrender.com`

**Update Archestra MCP Server URL:**

- Change from `http://host.docker.internal:4100/mcp`
- To: `https://incident-triage-studio.onrender.com/mcp`

### Option B: Railway.app (Alternative - Free Trial)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `incident-triage-studio`
5. Railway auto-detects Dockerfile
6. Click "Deploy"
7. Go to Settings → Generate Domain
8. Copy the URL

### Option C: Fly.io (Advanced)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
cd /home/parasjagdale/autoops-ai/incident-triage-studio
flyctl launch

# Deploy
flyctl deploy
```

## Step 5: Test Deployed Endpoint

```bash
# Health check
curl https://YOUR-DEPLOYMENT-URL/health

# MCP metadata
curl https://YOUR-DEPLOYMENT-URL/

# Should return:
# {"service":"Incident Triage Studio MCP Server","version":"1.0.0",...}
```

## Step 6: Update Archestra Configuration

1. Go to Archestra → Settings → MCP Servers
2. Edit "Incident Triage Studio"
3. Update URL to deployed endpoint
4. Click "Test Connection"
5. Should show "Connected" ✓

## Step 7: Update Submission Form

Edit [HACKATHON-SUBMISSION.md](HACKATHON-SUBMISSION.md):

- Add your GitHub URL
- Add your deployed URL (if deployed)
- Copy these to the hackathon form

## Troubleshooting

### Git push fails

```bash
# If you see "remote already exists"
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/incident-triage-studio.git

# If you see "Permission denied"
# Use GitHub Personal Access Token instead of password
```

### Deployment fails

- Check Dockerfile is in root directory ✓
- Check port 4100 is exposed in Dockerfile ✓
- Check package.json has correct start script ✓
- Check deployment logs for specific errors

### MCP connection fails after deployment

- Ensure deployed URL uses HTTPS (not HTTP)
- Check health endpoint returns 200
- Verify CORS headers if needed
- Check Render/Railway logs for startup errors

## Repository Cleanup Before Pushing

**Remove sensitive files** (if any):

```bash
# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
*.log
tmp/
.DS_Store
EOF

# Remove node_modules if committed
git rm -r --cached node_modules
git commit -m "Remove node_modules"
```

## Final Checklist

Before submitting to hackathon:

- [ ] Code pushed to GitHub
- [ ] README.md looks professional on GitHub
- [ ] Repository is public
- [ ] LICENSE file added (optional)
- [ ] Deployment successful (optional)
- [ ] Deployed endpoint tested
- [ ] Archestra connected to deployed URL
- [ ] GitHub link copied for form
- [ ] Deployed link copied for form
- [ ] Video link ready

## Quick Commands Reference

```bash
# Check git status
git status

# View remote URL
git remote -v

# Test local server
curl http://localhost:4100/health

# Test deployed server
curl https://YOUR-URL/health

# View deployment logs (Render)
# Go to Render dashboard → Your service → Logs

# View deployment logs (Railway)
# Go to Railway dashboard → Your project → Deployments
```

## Need Help?

- **Git issues**: https://docs.github.com/en/get-started
- **Render deployment**: https://render.com/docs
- **Railway deployment**: https://docs.railway.app
- **Docker issues**: Check Dockerfile and docker-compose.yml syntax

Good luck! 🚀

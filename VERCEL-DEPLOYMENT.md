# 🚀 Vercel Deployment Guide - Incident Triage Studio

Complete step-by-step guide to deploy Incident Triage Studio to Vercel.

## Prerequisites

- GitHub account (with this repo pushed)
- Vercel account (free tier works)
- Node.js 20+ (for local testing)

---

## Method 1: Deploy via GitHub (Recommended - Auto Updates)

### Step 1: Prepare Your GitHub Repository

```bash
# Ensure all changes are committed
git add -A
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

### Step 3: Import Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Search for `incident-triage-studio`
4. Select it and click **"Import"**

### Step 4: Configure Project

Vercel auto-detects settings, but verify:

- **Framework Preset**: Node.js
- **Build Command**: `npm install` (should auto-fill)
- **Output Directory**: (leave blank)
- **Environment Variables**: None needed for demo

Click **"Deploy"**

### Step 5: Monitor Deployment

- Watch the build logs in real-time
- Deployment takes ~2-3 minutes
- You'll get a URL like: `https://incident-triage-studio-abc123.vercel.app`

---

## Method 2: Deploy via CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd incident-triage-studio
vercel
```

### Step 3: Answer Prompts

```
? Set up and deploy "~/incident-triage-studio"? (y/N) y
? Which scope do you want to deploy to? (select your account)
? Link to existing project? (y/N) N
? What's your project's name? incident-triage-studio
? In which directory is your code? ./
? Want to modify vercel.json? (y/N) N
? Want to override the settings above? (y/N) N
```

### Step 4: Get Your URL

After deployment completes:

```
✓ Deployed to https://incident-triage-studio-abc123.vercel.app
```

---

## Testing Your Deployment

### Test 1: Health Check

```bash
curl https://incident-triage-studio-abc123.vercel.app/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "Incident Triage Studio",
  "version": "1.0.0",
  "timestamp": "2026-02-15T14:00:00.000Z",
  "endpoints": {
    "mcp": "/api/mcp",
    "health": "/api/health"
  }
}
```

### Test 2: MCP Triage Endpoint

```bash
curl -X POST https://incident-triage-studio-abc123.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "logText": "ERROR: Cannot find module express\nat Function.Module._resolveFilename\nFAILED: Build exited with code 1"
  }'
```

Expected response:

```json
{
  "incidentId": "INC-1707998400000",
  "timestamp": "2026-02-15T14:00:00.000Z",
  "severity": "High",
  "rootCause": "ERROR: Cannot find module express",
  "suggestedActions": [
    "Run npm install and verify package-lock.json is committed",
    "Notify on-call and consider rollback if impact is production"
  ],
  "githubIssue": { ... },
  "slackAlert": { ... }
}
```

---

## Configure in Archestra

Once deployed, add to Archestra:

### 1. Add MCP Server

```
Name: Incident Triage Studio
URL: https://incident-triage-studio-abc123.vercel.app/api/mcp
Transport: HTTP
Protocol: MCP
```

### 2. Configure Tool

```
Tool Name: triage_incident
Input: { logText: string }
Auth: None (for demo)
Health Check: https://incident-triage-studio-abc123.vercel.app/api/health
```

### 3. Test in Agent

In Archestra chat, try:

```
Analyze this error:
ERROR: Cannot find module 'express'
FAILED: Build exited with code 1
```

---

## Troubleshooting

### Deployment Failed

**Check build logs:**

```bash
vercel logs https://incident-triage-studio-abc123.vercel.app
```

**Common issues:**

- Missing dependencies → Run `npm install` locally first
- Node version mismatch → Verify `package.json` has `"engines": { "node": ">=20" }`
- Port already in use → Vercel handles this automatically

### 404 on API endpoints

- Ensure URLs use `/api/mcp` and `/api/health` paths
- Check that files exist in `api/` folder
- Redeploy if files were just added: `vercel --prod`

### Timeout Errors

- API has 60-second timeout
- Incident triage completes in <100ms, so shouldn't timeout
- Check Vercel function logs

---

## Auto-Deploy Updates

After initial setup, any push to `main` automatically redeploys:

```bash
git add .
git commit -m "Update incident triage logic"
git push origin main
```

Watch deployment at: https://vercel.com/dashboard

---

## Get Your Submission URL

After successful deployment, your URL for hackathon submission:

```
https://incident-triage-studio-abc123.vercel.app
```

Use this in:

- ✅ Hackathon submission form
- ✅ Archestra tool configuration
- ✅ README (update with your actual URL)
- ✅ Video demo (show domain in browser)

---

## Advanced: Custom Domain

(Optional, but adds professionalism)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records (instructions provided by Vercel)
4. Wait 5-10 minutes for DNS propagation

Example: `https://incident-triage.yourname.dev`

---

## Next Steps

1. ✅ Deploy to Vercel (this guide)
2. Record 3-minute video demo (show Archestra calling your tool)
3. Push final code to GitHub
4. Fill hackathon submission form
5. Submit! 🚀

---

**Questions?** Check Vercel docs: https://vercel.com/docs

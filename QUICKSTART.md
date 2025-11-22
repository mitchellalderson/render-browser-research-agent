# 🚀 Quickstart Guide

Get the AI Browser Research Agent running locally in under 5 minutes using Docker Compose!

## Prerequisites

- **Docker Desktop** installed ([Download here](https://www.docker.com/products/docker-desktop))
- **Browserbase account** ([Sign up for free](https://browserbase.com))
- **Anthropic API key** ([Get one here](https://console.anthropic.com))

That's it! Docker handles everything else (Node.js, TypeScript, WebSockets, etc.)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd render-browser-research-agent
```

### 2. Get Your API Keys

#### Browserbase (Required for web crawling)
1. Sign up at [browserbase.com](https://browserbase.com)
2. Go to your dashboard
3. Copy your **API Key** (starts with `bb_`)
4. Copy your **Project ID**

#### Anthropic (Required for AI analysis)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Create a new API key (starts with `sk-ant-`)
5. Copy the key (shown only once!)

### 3. Create Environment File

Create a file named `.env` in the root directory:

```bash
# Copy this template and fill in your actual API keys
cat > .env << 'EOF'
# Browserbase Configuration (REQUIRED)
BROWSERBASE_API_KEY=bb_your_actual_api_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here

# Anthropic Configuration (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-your_actual_key_here

# Optional: Choose AI model (default: claude-3-5-sonnet-20241022)
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
EOF
```

**Important:** Replace the placeholder values with your real API keys!

### 4. Start Everything

```bash
docker compose up -d
```

This single command will:
- ✅ Build and start the backend API with WebSocket support
- ✅ Build and start the frontend UI
- ✅ Configure automatic health checks
- ✅ Set up networking between services
- ✅ Enable auto-restart on failure

**First-time setup takes 2-3 minutes** to build Docker images. Subsequent starts are instant!

### 5. Open the App

Once the containers are running, open your browser to:

**http://localhost:3000**

You should see the chat interface. Try entering:
- `render.com`
- `https://anthropic.com`
- `stripe.com`

Watch as the agent crawls the website in real-time and provides AI-generated insights!

## 🎉 You're Done!

That's it! You now have a fully functional AI-powered web research agent with:
- Real-time browser automation (Browserbase + Playwright)
- AI-powered analysis (Anthropic Claude)
- Beautiful chat interface with live updates
- WebSocket-based progress tracking

## Useful Commands

### View logs
```bash
# All services
docker compose logs -f

# Just backend
docker compose logs -f backend

# Just frontend
docker compose logs -f frontend
```

### Stop everything
```bash
docker compose down
```

### Restart everything
```bash
docker compose restart
```

### Rebuild after code changes
```bash
docker compose up -d --build
```

## What's Running?

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | http://localhost:3000 | Chat UI |
| Backend API | http://localhost:3001 | WebSocket + REST API |

## Verify It's Working

### 1. Check all services are running:
```bash
docker compose ps
```

You should see both services with status "Up" and "healthy" for backend.

### 2. Check backend health:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T12:00:00.000Z",
  "websocketConnections": 0
}
```

### 3. Test the UI:
1. Open http://localhost:3000
2. Enter a URL like `render.com`
3. Click **Analyze** or press Enter
4. Watch the real-time progress updates
5. Receive an AI-generated summary!

## Troubleshooting

### Port already in use?

If you see errors about ports 3000 or 3001 already being used:

```bash
# Find what's using the ports
lsof -i :3000
lsof -i :3001

# Stop those services or edit docker-compose.yml to use different ports
```

### API Key errors?

1. Verify your API keys are correct in `.env`
2. Make sure you didn't include quotes around the API keys
3. Check for extra spaces or newlines
4. Ensure Browserbase key starts with `bb_`
5. Ensure Anthropic key starts with `sk-ant-`

### Browserbase errors?

1. Check your Browserbase account is active at [browserbase.com](https://browserbase.com)
2. Verify you have available sessions in your plan
3. Confirm both `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` are correct
4. Check Browserbase status page for any outages

### Anthropic API errors?

1. Verify your API key is active at [console.anthropic.com](https://console.anthropic.com)
2. Check your account has available credits
3. Confirm billing information is set up
4. Review backend logs: `docker compose logs backend`

### Services won't start?

```bash
# Stop everything and rebuild
docker compose down
docker compose up -d --build

# Check logs for specific errors
docker compose logs -f
```

### Fresh start?

To completely reset everything and start from scratch:

```bash
# WARNING: This removes all containers and images!
docker compose down
docker system prune -f
docker compose up -d --build
```

## Cost Considerations

### Browserbase Usage

- **Free tier**: 50 sessions/month (perfect for testing!)
- **Session duration**: Typically 1-2 minutes per analysis
- **Paid plans**: Start at $50/month for 500 sessions

**Tip:** Use the free tier for development and testing!

### Anthropic API Usage

- **Per analysis cost**:
  - Claude 3.5 Haiku: ~$0.001-0.005 (fastest, cheapest)
  - Claude 3.5 Sonnet: ~$0.01-0.03 (recommended, best balance)
  - Claude 3 Opus: ~$0.05-0.15 (most capable, highest quality)

**Tip:** Start with Sonnet (default) for the best balance of speed, quality, and cost!

### Free Alternatives for Learning

If you want to learn without spending money:
1. Use Browserbase free tier (50 sessions/month)
2. Anthropic offers $5 in free credits for new accounts
3. Analyze smaller websites with fewer pages (set maxPages to 1-2)

## What's Next?

### Customize AI Model

Edit `.env` to change the AI model:

```bash
# For faster, cheaper analysis:
ANTHROPIC_MODEL=claude-3-5-haiku-20241022

# For best balance (default):
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# For maximum quality and detail:
ANTHROPIC_MODEL=claude-3-opus-20240229
```

Then restart:
```bash
docker compose restart backend
```

### Ask Follow-up Questions

After analyzing a website, you can ask follow-up questions about it! The session lasts 30 minutes:
- "What are their main products?"
- "Who is their target audience?"
- "Tell me about their pricing"

### Adjust Crawling Depth

Use the slider in the UI to control how many pages to analyze (1-10 pages):
- **1-2 pages**: Quick overview, fastest
- **3-5 pages**: Good balance, recommended
- **6-10 pages**: Comprehensive analysis, slower

### Deploy to Production

Ready to share your app with the world? Deploy to Render.com for production use!

👉 **[Continue to Production Deployment Guide →](#-deploy-to-production-on-rendercom)**

---

# 🚢 Deploy to Production on Render.com

Take your local setup to production in just a few clicks!

## Why Render.com?

- ✅ **One-click deployment** using our included blueprint
- ✅ **Automatic HTTPS** with SSL certificates
- ✅ **Auto-deploy on git push** - continuous deployment
- ✅ **Built-in monitoring** and logs
- ✅ **Zero DevOps hassle** - Render handles infrastructure
- ✅ **Free trial available** - Test before you commit

**Monthly Cost:** ~$14 (Starter plan for both services)

## Prerequisites for Deployment

Before deploying to Render:
1. ✅ Your code in a **GitHub repository** (public or private)
2. ✅ Your **API keys** ready (Browserbase + Anthropic)
3. ✅ A **Render.com account** ([Sign up for free](https://dashboard.render.com/register))

## Deployment Steps

### 1. Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### 2. Connect to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub account (if not already connected)
4. Select your repository
5. Render will automatically detect the `render.yaml` file ✨

### 3. Configure Environment Variables

Render will prompt you for the required environment variables:

#### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `BROWSERBASE_API_KEY` | Your Browserbase API key | `bb_abc123...` |
| `BROWSERBASE_PROJECT_ID` | Your Browserbase project ID | `proj_xyz789...` |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | `sk-ant-api03...` |

**Optional Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_MODEL` | `claude-3-5-sonnet-20241022` | Choose AI model (Haiku/Sonnet/Opus) |

### 4. Deploy!

1. Review your configuration
2. Click **Apply** 
3. Watch the magic happen! 🎉

**Deployment takes 3-5 minutes:**
- ✅ Backend builds and starts
- ✅ Frontend builds and starts
- ✅ Services connect automatically
- ✅ Health checks verify everything works

### 5. Access Your Live App!

Once deployment is complete, Render provides you with URLs:
- **Frontend**: `https://your-app-name.onrender.com`
- **Backend**: `https://your-app-name-backend.onrender.com`

Open the frontend URL and start analyzing websites! 🚀

## What Render Sets Up For You

Render automatically configures:
- 🔒 **HTTPS/SSL certificates** - Secure by default
- 🔄 **Auto-deploy** - Push to GitHub → automatic deployment
- 📊 **Health checks** - Backend `/health` endpoint monitoring
- 🔗 **Service networking** - Frontend ↔ Backend communication
- 📝 **Logs** - Real-time application logs
- 🔄 **Auto-restart** - Services restart if they crash

## Render Dashboard Features

### View Logs
1. Go to your service (backend or frontend)
2. Click **Logs** tab
3. See real-time application logs

### Monitor Health
1. Check the **Events** tab for health status
2. View deployment history
3. Monitor uptime and performance

### Update Environment Variables
1. Go to your backend service
2. Click **Environment** tab
3. Add/edit variables
4. Service automatically restarts

### Manual Deploy
1. Go to your service
2. Click **Manual Deploy** → **Deploy latest commit**
3. Or use **Clear build cache & deploy** for a fresh build

## Custom Domain (Optional)

Want to use your own domain?

1. Go to your frontend service
2. Click **Settings** → **Custom Domain**
3. Add your domain (e.g., `research.yourcompany.com`)
4. Update your DNS records as instructed
5. Render handles SSL automatically!

**Cost:** Free with any paid plan

## Managing Costs on Render

### Starter Plan (~$14/month)
- **Backend**: $7/month
- **Frontend**: $7/month
- **Total**: $14/month
- Includes: 512 MB RAM per service, auto-deploy, HTTPS, monitoring

### Free Tier Option
Render offers free tiers with limitations:
- Services spin down after 15 minutes of inactivity
- 750 hours/month of usage
- Slower cold starts

**Recommendation:** Start with paid Starter plan for best experience ($14/month is great value!)

### Additional Costs
- **Browserbase**: Free tier (50 sessions/month) or paid plans from $50/month
- **Anthropic API**: Pay-per-use based on model and usage
  - Haiku: ~$0.001-0.005 per analysis
  - Sonnet: ~$0.01-0.03 per analysis
  - Opus: ~$0.05-0.15 per analysis

## Updating Your Deployed App

### Automatic Updates (Recommended)
Just push to GitHub:
```bash
git add .
git commit -m "Update feature X"
git push
```

Render automatically:
1. Detects the push
2. Builds new Docker images
3. Deploys with zero downtime
4. Rolls back if health checks fail

### Manual Updates
1. Go to Render Dashboard
2. Select your service
3. Click **Manual Deploy**
4. Choose **Deploy latest commit**

## Production Tips

### 1. Use Appropriate AI Model
For production, consider:
- **High traffic**: Use Haiku for speed and cost
- **Balanced**: Use Sonnet (default)
- **Premium**: Use Opus for best quality

### 2. Set Up Monitoring
- Enable Render notifications for deployment failures
- Monitor your Anthropic API usage at [console.anthropic.com](https://console.anthropic.com)
- Check Browserbase session usage at [browserbase.com](https://browserbase.com)

### 3. Protect Your API Keys
- ✅ Never commit `.env` file to git (already in `.gitignore`)
- ✅ Use Render's encrypted environment variables
- ✅ Rotate keys periodically
- ✅ Use separate keys for development and production

### 4. Scale as Needed
When traffic grows:
1. Upgrade to Standard plan ($25/month per service)
2. Increase memory/CPU allocation
3. Consider implementing rate limiting

## Troubleshooting Deployment

### Build Failed?

Check the build logs in Render:
1. Go to service → **Events** tab
2. Look for error messages
3. Common issues:
   - Missing dependencies in `package.json`
   - Docker build errors
   - TypeScript compilation errors

### Service Unhealthy?

If health checks fail:
1. Check backend logs for startup errors
2. Verify environment variables are set
3. Ensure API keys are valid
4. Check Browserbase and Anthropic service status

### Frontend Can't Connect to Backend?

The `render.yaml` automatically configures service URLs, but verify:
1. Backend service is healthy (green status)
2. `ALLOWED_ORIGINS` includes your frontend URL
3. Check CORS settings in backend logs

### High Costs?

Optimize your usage:
1. Switch to Claude Haiku model for cheaper analysis
2. Reduce `maxPages` default in settings
3. Monitor Anthropic API usage dashboard
4. Consider implementing caching for repeated analyses

## Support

### Render Support
- **Documentation**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)
- **Status**: [status.render.com](https://status.render.com)

### API Provider Support
- **Browserbase**: [docs.browserbase.com](https://docs.browserbase.com)
- **Anthropic**: [docs.anthropic.com](https://docs.anthropic.com)

### Project Issues
- **GitHub Issues**: Report bugs or request features
- **Local Testing**: Test locally first with Docker Compose

---

## Common Questions

**Q: Can I use a different cloud provider?**
A: Yes! The included Dockerfiles work with any Docker-compatible host (AWS, GCP, Azure, DigitalOcean, etc.). Render is just our recommended option for ease of use.

**Q: How do I rollback a bad deployment?**
A: Go to your service → **Manual Deploy** → Select a previous deployment from the list → **Deploy selected commit**

**Q: Can I use a different AI model?**
A: Yes! Currently supports all Anthropic Claude models. To add other providers (OpenAI, Cohere, etc.), you'd need to modify the backend code.

**Q: Is my data secure?**
A: Yes! All communication is over HTTPS. API keys are encrypted by Render. No data is stored permanently - each analysis is ephemeral.

**Q: How do I see how much I'm spending?**
A: 
- **Render**: Dashboard → Billing
- **Browserbase**: Dashboard → Usage
- **Anthropic**: Console → Usage & Billing

**Q: Can I limit the number of pages crawled?**
A: Yes! The UI has a slider (1-10 pages). You can also modify the backend to enforce stricter limits.

**Q: What happens if a service goes down?**
A: Render automatically restarts failed services. You can also set up notifications for downtime alerts.

---

## Next Steps

🎉 **Congratulations!** Your AI Browser Research Agent is now live in production!

### Share Your App
- Share the frontend URL with your team
- Add it to your portfolio
- Show it off on social media!

### Customize Further
- Modify the UI styling in `frontend/`
- Adjust AI prompts in `backend/src/services/anthropic.service.ts`
- Add new features and redeploy automatically

### Monitor Usage
- Keep an eye on API costs
- Monitor Render service health
- Check logs regularly for issues

### Get Help
- Read the full [README.md](./README.md) for detailed documentation
- Check [API Documentation](./README.md#-api-documentation)
- Join the community or reach out for support

---

**That's it!** You've successfully deployed your AI Browser Research Agent from local development to production. Start analyzing websites at scale! 🚀

**Built with ❤️ using Docker, Render.com, Browserbase, and Anthropic Claude**


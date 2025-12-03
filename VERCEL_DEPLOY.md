# Deploy email sender to Vercel

This adds a minimal Vercel serverless API at `api/sendInviteEmail.ts` that sends emails via Resend.

## Prereqs
- Vercel account; CLI installed (`npm i -g vercel`) or use the dashboard.
- An email provider API key (e.g., Resend), free tier is fine.

## Deploy steps
1. Login and deploy
```powershell
vercel login
cd "d:\B.Tech Engineering\0.PROJECTS\Secure Data Sharing Platform\pilot_project"
vercel
```
Follow the prompts to create/link a project.

2. Set server env in Vercel dashboard
- Go to Project → Settings → Environment Variables
- Add `RESEND_API_KEY` with your provider key (Production and Preview)
- Redeploy

3. Use the endpoint in your app
- Find your Vercel URL (e.g., `https://secureshare.vercel.app`)
- Set in `.env`:
```
VITE_EMAIL_FUNCTION_URL=https://<your-vercel-app>.vercel.app/api/sendInviteEmail
```
- Restart your dev server.

## Test
- Approve or Resend Invite from `AdminApproval` page.
- If errors occur, check Vercel function logs, confirm `RESEND_API_KEY` is set, and that the sender domain is verified in your email provider.

## Notes
- `vercel.json` sets Node 18 runtime for API functions.
- Keep secrets in Vercel env; do not store provider keys in client `.env`.

## Windows PowerShell: "running scripts is disabled"
If you see an error like "running scripts is disabled on this system" when running `vercel`, use one of these options:

1) Use npx (avoids PowerShell shim)
```powershell
npx vercel@latest login
npx vercel@latest
```

2) Use Command Prompt (cmd.exe) instead of PowerShell
```bat
vercel login
vercel
```

3) Temporarily bypass for current PowerShell session only
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
vercel login
vercel
```

4) Permanently allow scripts for current user (safer setting)
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
vercel login
vercel
```

5) Skip CLI entirely: use Vercel Dashboard
- Go to vercel.com → New Project → Import your repo
- After import, add `RESEND_API_KEY` in Project → Settings → Environment Variables
- Redeploy

## Auto-deploy latest code from GitHub
To have Vercel automatically deploy the latest commits:

1) Connect Git repo
- In Vercel Project → Settings → Git, connect to your GitHub repo (`AnirudhGKulkarni/secureshare`).
- Set Production Branch to `main`.

2) Enable auto-deploy
- Ensure "Deploy Previews" is ON (for PRs) and "Automatically Deploy to Production" is ON for the Production Branch.

3) Push to deploy
- Any push to `main` triggers a Production deployment.
- Any PR or push to non-main branches creates a Preview deployment.

4) Environment Variables
- Set `RESEND_API_KEY` for both Preview and Production.
- Client `.env` is not used by Vercel builds unless committed; prefer setting server-side env in Vercel.

Optional: Deploy Hook
- Project → Settings → Git → Deploy Hooks → Create Hook (Production).
- Call it from CI or scripts to trigger a deploy:
```powershell
Invoke-WebRequest -Uri "https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxxx" -Method POST | Out-Null
```

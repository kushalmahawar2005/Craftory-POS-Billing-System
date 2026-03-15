---
description: How to safely push changes and resolve conflicts in the Craftory POS project
---

# Git Push & Conflict Resolution Workflow

Follow these steps whenever you have new local changes and want to update your branch or push to GitHub.

## Step 1: Commit Your Work
Always save your progress locally before doing anything related to remote branches.
```powershell
git add .
git commit -m "feat: [describe your change]"
```

## Step 2: Sync with Master
Instead of merging, we use **Rebase** to keep the history clean and ensure your new code sits on top of the latest Master changes.
```powershell
git fetch origin master
git rebase origin/master
```

## Step 3: Resolve Conflicts (The Rules)
If you see "CONFLICT", don't panic. Open the files and follow these rules we established:

| File Type | Strategy | Why? |
| :--- | :--- | :--- |
| **Frontend** (`src/components/**`, `*.css`, `(dashboard)/**`) | **Accept Current (Yours)** | To keep your new UI/Design. |
| **Backend** (`src/lib/**`, `src/app/api/**`, `prisma/**`) | **Accept Incoming (Master)** | To keep the latest DB/Auth logic. |
| **Config** (`package.json`) | **Merge Both** | Keep dependencies from both sides. |

After resolving:
```powershell
git add .
git rebase --continue
```

## Step 4: Push to Your Branch
Since we used Rebase, you need to use `--force-with-lease` to update GitHub safely.
```powershell
git push origin naman-web --force-with-lease
```

> [!IMPORTANT]
> Never use `git push --force` (without `-with-lease`) as it can overwrite someone else's work.

## Step 5: Verification (Optional but Recommended)
After pushing, ensure Docker is still running correctly:
```powershell
docker-compose up -d
npm run dev
```

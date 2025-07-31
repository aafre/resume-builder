# Branch Protection Setup Guide

To complete the conventional commits enforcement, you need to enable GitHub branch protection rules.

## Steps to Enable Branch Protection:

### 1. Go to Repository Settings
- Navigate to your repository on GitHub
- Click **Settings** tab
- Click **Branches** in the left sidebar

### 2. Add Branch Protection Rule
- Click **Add rule**
- Enter branch name pattern: `main`

### 3. Configure Protection Settings
Enable these options:

✅ **Require a pull request before merging**
- Require approvals: 1 (optional, adjust as needed)
- Dismiss stale PR approvals when new commits are pushed

✅ **Require status checks to pass before merging**
- Require branches to be up to date before merging
- Add these required status checks:
  - `Validate PR Title` (from pr-validation.yml)
  - `Frontend Tests` (from docker-build-and-deploy.yml)
  - `Build Docker Image` (from docker-build-and-deploy.yml)

✅ **Require conversation resolution before merging**

✅ **Restrict pushes that create files larger than 100 MB**

### 4. Additional Recommended Settings
✅ **Require linear history** (prevents merge commits)
✅ **Allow squash merging** (PR title becomes commit message)
❌ **Allow merge commits** (disable to keep clean history)
❌ **Allow rebase merging** (optional, based on team preference)

## Result
Once enabled, PRs can only be merged if:
1. ✅ PR title follows conventional commits format
2. ✅ All tests pass
3. ✅ All status checks are green
4. ✅ Required approvals are met (if configured)

This ensures every commit on main branch:
- Has a conventional commit message (from PR title)
- Has passed all tests
- Will trigger appropriate version bumps and releases

## Testing the Setup
1. Create a PR with non-conventional title like "update readme"
2. Verify it shows a red ❌ status check
3. Update title to "docs: update readme"  
4. Verify it shows green ✅ and allows merge
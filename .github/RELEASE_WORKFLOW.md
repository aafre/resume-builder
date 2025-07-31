# Release Workflow Guide

## 🎯 New Release Strategy

The release process has been updated to support **batching multiple PRs into a single release** while maintaining emergency hotfix capabilities.

## 📋 How It Works

### Regular Development Releases (Manual)

1. **Merge multiple PRs** to `main` branch
   - No automatic release triggered
   - All changes accumulate on main

2. **Trigger release manually** when ready:
   - Go to **Actions** → **Release & Deploy**
   - Click **"Run workflow"**
   - Choose version bump type:
     - `auto` - Uses conventional commit types (feat/fix/docs)
     - `patch` - Bug fixes and small changes
     - `minor` - New features  
     - `major` - Breaking changes
   - Add optional release notes
   - Click **"Run workflow"**

3. **Single release created** with:
   - All changes since last release
   - Automatic changelog from git-cliff
   - Your custom release notes (if provided)

### Emergency Hotfixes (Automatic)

For urgent fixes that need immediate release:

1. Create hotfix branch: `hotfix/critical-bug-fix`
2. Make fixes and push to the hotfix branch
3. **Automatic release triggered** on push
4. Release marked as "🚨 Hotfix Release"

## 🔄 Migration Benefits

- ✅ **Batch releases** - Group related features together
- ✅ **Clean release history** - Meaningful releases only  
- ✅ **Full control** - Release exactly when you want
- ✅ **Emergency support** - Hotfixes still auto-release
- ✅ **No breaking changes** - Same git-cliff and deployment

## 📝 Best Practices

### Commit Messages (for auto-versioning)
```bash
feat: add drag-and-drop section reordering     # minor version bump
fix: resolve PDF generation error              # patch version bump
docs: update API documentation                 # patch version bump
feat!: redesign entire UI                     # major version bump (breaking)
```

### Release Cadence
- **Weekly releases** for regular development
- **Feature-based releases** for major milestones
- **Immediate hotfixes** for critical bugs

### Manual Release Notes Examples
```
🎉 Weekly Release - New Features & Improvements

This release includes the new drag-and-drop functionality 
and several UI polish improvements based on user feedback.
```

## 🚨 Emergency Procedures

If you need to release immediately:

1. **Option A**: Manual trigger (2 minutes)
   - Actions → Release & Deploy → Run workflow

2. **Option B**: Hotfix branch (automatic)
   - `git checkout -b hotfix/urgent-fix`
   - Make changes and push
   - Auto-release triggers

## 📊 Workflow Comparison

| Before | After |
|--------|-------|
| Every merge = release | Manual control |
| 10 PRs = 10 releases | 10 PRs = 1 release |
| Cluttered history | Clean milestones |
| No emergency path | Hotfix auto-release |

The new system gives you the best of both worlds: controlled batching for development and immediate releases for emergencies.
# Resume Builder Documentation

This directory contains comprehensive setup and configuration guides for the Resume Builder application.

---

## 📚 Documentation Index

### Authentication & OAuth

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[OAUTH_QUICK_START.md](OAUTH_QUICK_START.md)** | Fast-track OAuth setup (15-20 min) | ⭐ Start here for quick development setup |
| **[OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)** | Complete OAuth reference with troubleshooting | Production deployment, troubleshooting issues |

### Supabase Setup

| Document | Location | Purpose |
|----------|----------|---------|
| **[SUPABASE_SETUP_RUNBOOK.md](../SUPABASE_SETUP_RUNBOOK.md)** | Root directory | Complete Supabase project setup from scratch |
| **[Parse Resume Function README](../supabase/functions/parse-resume/README.md)** | supabase/functions/parse-resume/ | AI resume parser Edge Function deployment guide |

### Project Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| **[CLAUDE.md](../CLAUDE.md)** | Root directory | AI assistant guidelines and project overview |

---

## 🚀 Quick Start Paths

### For First-Time Setup

**1. Set up Supabase project:**
- Follow: `../SUPABASE_SETUP_RUNBOOK.md`
- Time: ~30 minutes

**2. Set up OAuth (optional but recommended):**
- Follow: `OAUTH_QUICK_START.md`
- Time: ~15-20 minutes

**3. Start developing:**
- Follow instructions in main project README

### For Production Deployment

**1. Review Supabase setup:**
- Check: `../SUPABASE_SETUP_RUNBOOK.md` → Part 8 (Deploy to Production)

**2. Configure OAuth for production:**
- Follow: `OAUTH_SETUP_GUIDE.md` → Part 3 (Production Deployment)

**3. Complete deployment checklist:**
- Check: `../SUPABASE_SETUP_RUNBOOK.md` → Deployment Checklist

---

## 📖 Document Summaries

### OAUTH_QUICK_START.md

**Purpose:** Get OAuth working quickly in development

**Contents:**
- Streamlined Google OAuth setup (10 min)
- Streamlined LinkedIn OAuth setup (10 min)
- Quick testing instructions
- Essential troubleshooting

**Best for:**
- Developers setting up local environment
- Quick testing of OAuth functionality
- First-time OAuth configuration

### OAUTH_SETUP_GUIDE.md

**Purpose:** Comprehensive OAuth reference and production guide

**Contents:**
- Detailed Google OAuth setup with screenshots
- Detailed LinkedIn OAuth setup with screenshots
- Production deployment instructions
- Complete troubleshooting guide
- Security best practices
- Monitoring and analytics
- Common error solutions

**Best for:**
- Production deployment
- Debugging OAuth issues
- Understanding OAuth security
- Team onboarding reference

### SUPABASE_SETUP_RUNBOOK.md

**Purpose:** Complete Supabase project setup guide

**Contents:**
- Database setup and migrations
- Authentication configuration
- Storage buckets setup
- Email templates customization
- OAuth provider configuration (summary)
- Security settings
- Production deployment
- Monitoring and maintenance

**Best for:**
- New Supabase project setup
- Production deployment checklist
- Team reference guide

---

## 🔍 Finding What You Need

### Common Tasks

**"I need to set up OAuth quickly"**
→ `OAUTH_QUICK_START.md`

**"OAuth isn't working"**
→ `OAUTH_SETUP_GUIDE.md` → Part 6: Troubleshooting

**"I'm deploying to production"**
→ `OAUTH_SETUP_GUIDE.md` → Part 3: Production Deployment
→ `SUPABASE_SETUP_RUNBOOK.md` → Part 8: Deploy to Production

**"I need to set up a new Supabase project"**
→ `SUPABASE_SETUP_RUNBOOK.md`

**"I need to configure email templates"**
→ `SUPABASE_SETUP_RUNBOOK.md` → Part 4.5: Customize Email Templates

**"I need to deploy the resume parser"**
→ `supabase/functions/parse-resume/README.md`

**"What does this codebase do?"**
→ `../CLAUDE.md`

---

## 🎯 Setup Checklist

### Development Environment

- [ ] Supabase project created
- [ ] Database migration executed
- [ ] Anonymous auth enabled
- [ ] Email auth configured (magic links working)
- [ ] Google OAuth configured (optional)
- [ ] LinkedIn OAuth configured (optional)
- [ ] Environment variables set (`.env` and `resume-builder-ui/.env.local`)
- [ ] Local development server running
- [ ] Can create and save resumes

### Production Environment

- [ ] All development items completed
- [ ] Production domain configured in Supabase
- [ ] OAuth apps updated for production URLs
- [ ] Email templates customized and tested
- [ ] **Edge Functions deployed** (see `supabase/functions/parse-resume/README.md`)
  - [ ] `parsed_resumes` table migration executed
  - [ ] `OPENAI_API_KEY` secret set
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` secret set
  - [ ] `parse-resume` function deployed
- [ ] CORS restricted to production domain
- [ ] Environment variables set in deployment environment
- [ ] HTTPS enabled
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] All tests passing in production

---

## 📝 Document Maintenance

### Update Schedule

- **OAUTH_QUICK_START.md**: Review quarterly or when OAuth providers change UI
- **OAUTH_SETUP_GUIDE.md**: Review quarterly or when OAuth providers change UI
- **SUPABASE_SETUP_RUNBOOK.md**: Review when Supabase releases major updates

### Version History

| Document | Current Version | Last Updated | Next Review |
|----------|----------------|--------------|-------------|
| OAUTH_QUICK_START.md | 1.0 | 2025-12-23 | 2026-03-23 |
| OAUTH_SETUP_GUIDE.md | 1.0 | 2025-12-23 | 2026-03-23 |
| SUPABASE_SETUP_RUNBOOK.md | 1.0 | 2025-12-22 | 2026-01-22 |
| parse-resume/README.md | 1.1 | 2025-12-29 | 2026-03-29 |

---

## 🤝 Contributing

When updating documentation:

1. Update version number and "Last Updated" date
2. Add changes to version history if significant
3. Test all instructions on a fresh environment if possible
4. Update this README if adding new documents

---

## 📞 Support

**Issues with documentation:**
- Open an issue in the GitHub repository
- Tag with `documentation` label

**Technical support:**
- Supabase: [discord.supabase.com](https://discord.supabase.com)
- Google OAuth: [support.google.com/cloud](https://support.google.com/cloud/answer/6158849)
- LinkedIn OAuth: [LinkedIn Developer Support](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)

---

**Last Updated:** 2025-12-29

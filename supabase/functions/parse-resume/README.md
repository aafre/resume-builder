# Resume Parser Edge Function

AI-powered resume parser backend using OpenAI gpt-4o-mini.

## Overview

This Supabase Edge Function converts PDF/DOCX resume files into structured YAML ready for import into the Resume Builder app.

**Features:**
- ✅ Parses PDF and DOCX files
- ✅ Extracts contact info, experience, education, skills, and more
- ✅ Returns YAML format matching app templates
- ✅ Hash-based caching (60%+ cache hit rate)
- ✅ Guard rails against non-resume files
- ✅ Prompt injection prevention
- ✅ Schema validation

**Cost:** ~$0.002 per upload with caching (~$4/month for 1,000 users)

---

## Prerequisites

1. **Supabase CLI** (install if not already):
   ```bash
   npm install -g supabase
   ```

2. **OpenAI API Key**:
   - Get key from: https://platform.openai.com/api-keys
   - Should start with `sk-`

3. **Supabase Project Keys**:
   - URL: `https://mgetvioaymkvafczmhwo.supabase.co`
   - Anon Key: (Dashboard > Settings > API > `anon` / `public`)
   - **Service Role Key**: (Dashboard > Settings > API > `service_role`)
     - ⚠️ **Required for global cache deduplication**
     - Never expose to frontend - server-side only

---

## Deployment Steps

### 1. Deploy Database Migration

Run the migration to create the `parsed_resumes` table:

```bash
cd C:\projects\resume-builder

# Login to Supabase (if not already)
supabase login

# Link to your project
supabase link --project-ref mgetvioaymkvafczmhwo

# Push migration
supabase db push
```

**Verify migration:**
```bash
# Check if parsed_resumes table exists
supabase db ls
```

### 2. Set Environment Variables

Set the required secrets:

```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-your-api-key-here

# Set Supabase Service Role Key (for global cache access)
# Get this from: Supabase Dashboard > Settings > API > service_role key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Verify secrets are set
supabase secrets list
```

**Expected output:**
```
OPENAI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

**⚠️ Security Note:**
- The service role key bypasses Row Level Security (RLS)
- It's used ONLY for global cache deduplication (read/write to `parsed_resumes` table)
- Never expose this key to the frontend - it's only used in the Edge Function server-side
- The function still requires user JWT authentication before allowing any operations

### 3. Deploy Edge Function

Deploy the parse-resume function:

```bash
# Deploy function
supabase functions deploy parse-resume

# Verify deployment
supabase functions list
```

**Expected output:**
```
Deployed Functions:
  ├─ parse-resume (20XX-XX-XX XX:XX:XX)
```

### 4. Test the Function

Test with curl:

```bash
# Get your JWT token from Supabase Dashboard or login
# Replace YOUR_JWT_TOKEN with actual token

curl -X POST https://mgetvioaymkvafczmhwo.supabase.co/functions/v1/parse-resume \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@path/to/resume.pdf"
```

**Expected response:**
```json
{
  "success": true,
  "yaml": "template: modern\nfont: Arial\n...",
  "confidence": 0.95,
  "warnings": [],
  "cached": false
}
```

---

## API Documentation

### Endpoint

```
POST https://mgetvioaymkvafczmhwo.supabase.co/functions/v1/parse-resume
```

### Request

**Headers:**
```
Authorization: Bearer <supabase_jwt_token>
Content-Type: multipart/form-data
```

**Body:**
```
file: <File> (PDF or DOCX, max 10MB)
```

### Response

**Success (200):**
```json
{
  "success": true,
  "yaml": "template: modern\nfont: Arial\ncontact_info:\n  name: John Doe\n...",
  "confidence": 0.95,
  "warnings": ["Phone number not found, used placeholder"],
  "cached": false,
  "file_info": {
    "name": "resume.pdf",
    "size": 123456,
    "type": "pdf"
  }
}
```

**Error (400/401/500):**
```json
{
  "success": false,
  "error": "Error message here",
  "validation_errors": ["Field X missing"],
  "raw_text": "Extracted text for debugging..."
}
```

### Error Codes

- **400**: Invalid file type, file too large, not a resume, low confidence
- **401**: Missing or invalid JWT token
- **500**: Text extraction failed, AI parsing failed, internal error

---

## Architecture

```
User uploads PDF/DOCX
       ↓
Edge Function: /parse-resume
       ↓
1. Authenticate user (JWT with anon key client)
2. Calculate file hash (SHA-256)
3. Check global cache (service role client) → Return if cached
4. Validate file (type, size, magic numbers)
5. Extract text (PDF/DOCX)
6. Guard rail: Is this a resume?
7. Call OpenAI gpt-4o-mini
8. Validate schema
9. Convert to YAML
10. Cache in DB globally (service role client, 30-day TTL)
11. Return YAML
```

### Security Model: Dual-Client Architecture

The function uses **two separate Supabase clients** for security:

1. **User Client** (`anon key` + JWT):
   - Used for: Authentication only (step 1)
   - Respects: Row Level Security (RLS)
   - Access: User can only see their own data

2. **Admin Client** (`service_role key`):
   - Used for: Cache operations only (steps 3, 10)
   - Bypasses: RLS for global deduplication
   - Access: Can read/write all cached resumes

**Why this approach?**
- ✅ **User privacy**: End users cannot query other users' PII via RLS
- ✅ **Cost efficiency**: Same resume uploaded by different users = cache hit
- ✅ **Security**: Service role key never exposed to frontend
- ✅ **Deduplication**: Hash-based cache works globally across all users

---

## File Structure

```
supabase/functions/parse-resume/
├── index.ts                      # Main entry point
├── types.ts                      # TypeScript types
├── deno.json                     # Dependencies
├── README.md                     # This file
├── utils/
│   ├── hash.ts                   # SHA-256 hashing
│   ├── resume-detector.ts        # Guard rail (keyword check)
│   ├── yaml-converter.ts         # JSON → YAML
│   └── file-validator.ts         # File validation
├── extractors/
│   ├── pdf-extractor.ts          # PDF text extraction
│   └── docx-extractor.ts         # DOCX text extraction
└── ai/
    ├── prompts.ts                # OpenAI system prompt
    ├── openai-client.ts          # OpenAI API wrapper
    └── validator.ts              # Schema validation
```

---

## Monitoring

### View Logs

```bash
# Real-time logs
supabase functions logs parse-resume --follow

# Recent logs
supabase functions logs parse-resume --limit 50
```

### Metrics to Track

1. **Cache Hit Rate**: Should be >50%
   - Query: `SELECT COUNT(*) FROM parsed_resumes WHERE created_at > NOW() - INTERVAL '24 hours'`

2. **Average Confidence**: Should be >0.80
   - Query: `SELECT AVG(confidence_score) FROM parsed_resumes`

3. **OpenAI Costs**: Check OpenAI dashboard
   - Target: <$10/month for 1,000 users

4. **Error Rate**: Monitor logs for 500 errors
   - Target: <5%

---

## Troubleshooting

### Issue: "Missing Authorization header"
**Solution:** Ensure JWT token is passed in `Authorization: Bearer <token>` header

### Issue: "File does not appear to be a resume"
**Solution:**
- Upload must contain resume keywords (experience, education, skills, etc.)
- Try a different resume file
- Check if PDF is scanned (use text-based PDF, not image)

### Issue: "Low confidence: File may not be a valid resume"
**Solution:**
- AI confidence <0.60 indicates unclear structure
- Try a simpler resume format
- Ensure resume has clear sections (Experience, Education, etc.)

### Issue: "OpenAI API error"
**Solution:**
- Check OpenAI API key is correct: `supabase secrets list`
- Verify OpenAI account has credits
- Check OpenAI status: https://status.openai.com/

### Issue: "Parsing failed validation"
**Solution:**
- Check logs: `supabase functions logs parse-resume`
- Contact support with `validation_errors` from response

---

## Development

### Local Testing (if Supabase CLI supports it)

```bash
# Serve locally
supabase functions serve parse-resume --env-file supabase/.env

# Test locally
curl -X POST http://localhost:54321/functions/v1/parse-resume \
  -H "Authorization: Bearer YOUR_LOCAL_TOKEN" \
  -F "file=@test.pdf"
```

### Update Function

After making code changes:

```bash
# Redeploy
supabase functions deploy parse-resume

# Verify
supabase functions logs parse-resume --limit 10
```

---

## Security

- ✅ **JWT authentication required** - Users must be authenticated
- ✅ **File size limit (10MB)** - Prevents abuse
- ✅ **File type validation (magic numbers)** - Prevents malicious files
- ✅ **Resume keyword detection (guard rail)** - Rejects non-resume files
- ✅ **Prompt injection prevention** - Text sanitization
- ✅ **Text truncation (50K chars max)** - Cost control
- ✅ **Schema validation** - Ensures output quality
- ✅ **RLS policies** - Users cannot query other users' PII directly
- ✅ **Dual-client architecture** - Service role used only for cache (trusted code)
- ✅ **Cache expiry (30 days)** - Auto-cleanup of old data

### PII Protection Model

**The Problem:**
- The `parsed_resumes` table contains full resume text and contact info (PII)
- If we allowed `SELECT USING (true)` in RLS, any user could query other users' data

**The Solution:**
- **RLS Policy**: Restrictive - users can only SELECT their own records
- **Service Role**: Function uses service role key to bypass RLS for cache operations
- **Trust Boundary**: Service role key is server-side only, never exposed to frontend
- **Result**: Global cache deduplication without compromising user privacy

---

## Cost Optimization

**Global Caching Strategy:**
- File hash (SHA-256) used as cache key
- Same file uploaded by **any user** = cache hit (via service role)
- 30-day TTL = balance between cost savings and freshness
- Service role enables global deduplication while maintaining RLS privacy

**Expected Savings:**
- Without cache: 2,000 parses/month × $0.005 = $10/month
- With 60% cache hit: 800 parses/month × $0.005 = $4/month
- **Savings: 60% ($6/month)**

**Note:** Global cache (vs user-scoped) increases hit rate significantly since popular resumes (e.g., from career services) get reused across users.

---

## Next Steps

1. **Frontend Integration** - Add "Upload Resume" button to UI
2. **Testing** - Beta test with real resume files
3. **Prompt Refinement** - Improve accuracy based on failures
4. **Icon Suggestions** - AI suggests icons for companies/schools (Phase 2)
5. **Grammar Checking** - Inline AI suggestions in editor (Phase 3)

---

## Support

- **GitHub Issues**: https://github.com/anthropics/resume-builder/issues
- **Supabase Logs**: `supabase functions logs parse-resume`
- **OpenAI Status**: https://status.openai.com/

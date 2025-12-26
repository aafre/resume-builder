# Resume Limit Race Condition Fix

## Problem

The current implementation has a race condition in the resume creation limit check:

```python
# app.py lines 1643-1650, 1815-1822
can_create, current_count = check_resume_limit(user_id)
if not can_create:
    return jsonify({...}), 403

# [RACE CONDITION WINDOW - multiple requests can pass here]

resume_id = str(uuid.uuid4())
supabase.table('resumes').insert(resume_data).execute()
```

**Attack Scenario:**
1. User has 4 resumes (limit is 5)
2. Browser sends 2 concurrent POST requests to `/api/resumes`
3. Both check limit → both get `can_create=True`
4. Both pass the check
5. Both insert successfully
6. **User now has 6 resumes** (limit bypassed!)

---

## Solution: Database-Level Atomic Check

Use a PostgreSQL function with row-level locking to make the check and insert atomic.

### Step 1: Create Supabase RPC Function

Run this SQL in your Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION create_resume_with_limit(
    p_user_id UUID,
    p_resume_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_count INTEGER;
    v_resume_id UUID;
BEGIN
    -- Lock the user's resume rows to prevent race conditions
    PERFORM 1 FROM resumes
    WHERE user_id = p_user_id
    AND deleted_at IS NULL
    FOR UPDATE;

    -- Count active resumes
    SELECT COUNT(*) INTO v_count
    FROM resumes
    WHERE user_id = p_user_id
    AND deleted_at IS NULL;

    -- Check limit
    IF v_count >= 5 THEN
        RETURN jsonb_build_object('error', 'LIMIT_REACHED');
    END IF;

    -- Insert resume
    INSERT INTO resumes (
        id, user_id, title, template_id, contact_info,
        sections, json_hash, created_at, updated_at, last_accessed_at
    )
    VALUES (
        uuid_generate_v4(),
        p_user_id,
        p_resume_data->>'title',
        p_resume_data->>'template_id',
        p_resume_data->'contact_info',
        p_resume_data->'sections',
        p_resume_data->>'json_hash',
        NOW(),
        NOW(),
        NOW()
    )
    RETURNING id INTO v_resume_id;

    RETURN jsonify_build_object('resume_id', v_resume_id);
END;
$$ LANGUAGE plpgsql;
```

### Step 2: Update app.py to Use RPC Function

Find the `save_resume()` function in app.py and replace the resume creation logic:

```python
# Around line 1815-1825
if not is_update:
    # OLD CODE (remove this):
    # can_create, current_count = check_resume_limit(user_id)
    # if not can_create:
    #     return jsonify({...}), 403
    # resume_id = str(uuid.uuid4())

    # NEW CODE (add this):
    # Use database transaction to atomically check and insert
    try:
        # Call Supabase RPC function that does atomic check + insert
        result = supabase.rpc('create_resume_with_limit', {
            'p_user_id': user_id,
            'p_resume_data': resume_data
        }).execute()

        if result.data and result.data.get('error') == 'LIMIT_REACHED':
            return jsonify({
                "success": False,
                "error": "Resume limit reached (5/5)",
                "error_code": "RESUME_LIMIT_REACHED"
            }), 403

        resume_id = result.data['resume_id']
    except Exception as e:
        logging.error(f"Failed to create resume atomically: {e}")
        return jsonify({"error": "Failed to create resume"}), 500
```

### Step 3: Test the Fix

1. **Test normal creation:**
   ```bash
   # Create 5 resumes - should succeed
   ```

2. **Test limit enforcement:**
   ```bash
   # Try to create 6th resume - should return 403 with RESUME_LIMIT_REACHED
   ```

3. **Test race condition:**
   ```bash
   # Send 2 concurrent create requests when at 4 resumes
   # Only 1 should succeed, the other should fail with limit error
   ```

---

## Alternative: Simpler Application-Level Fix

If you prefer not to create a database function, you can add retry logic:

```python
# Add to app.py
from functools import wraps
import time

def with_retry(max_retries=3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    time.sleep(0.1 * (2 ** attempt))  # Exponential backoff
            return None
        return wrapper
    return decorator

# Then in save_resume():
@with_retry(max_retries=3)
def check_and_create_resume():
    can_create, current_count = check_resume_limit(user_id)
    if not can_create:
        raise ValueError("LIMIT_REACHED")

    return supabase.table('resumes').insert(resume_data).execute()
```

This is less robust than the database solution but easier to implement.

---

## Recommendation

**Use the database-level RPC function** (Step 1-3 above) for:
- ✅ Guaranteed atomicity
- ✅ No race conditions
- ✅ Better performance (single round-trip)
- ✅ Proper database-level constraint enforcement

The application-level retry approach is a quick fix but doesn't eliminate the race condition, just makes it less likely.

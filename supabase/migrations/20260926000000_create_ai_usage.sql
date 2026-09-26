-- Create ai_usage table for per-user/IP daily rate limiting on AI edge functions
-- No RLS policies: only the service role (used by edge functions) can read/write this table.

CREATE TABLE public.ai_usage (
  id BIGSERIAL PRIMARY KEY,
  fn TEXT NOT NULL,
  user_id UUID,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_fn_user_created ON public.ai_usage(fn, user_id, created_at);
CREATE INDEX idx_ai_usage_fn_ip_created ON public.ai_usage(fn, ip, created_at);

-- Row Level Security (RLS) - enabled with NO policies, so only the service role can access
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.ai_usage IS 'Usage log for AI edge functions, used to enforce per-user/IP daily rate limits. Rows older than 7 days are purged opportunistically by the edge functions on insert. Service-role only (no RLS policies).';

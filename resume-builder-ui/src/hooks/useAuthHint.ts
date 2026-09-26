import { useSyncExternalStore } from "react";

export interface AuthHint {
  signedIn: boolean;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
}

/**
 * The session supabase-js persisted on the last visit, read synchronously.
 *
 * The SDK is lazy-loaded to keep it off the critical path, so AuthContext
 * stays `loading` for a few seconds on a cold load. Without a hint the header
 * renders signed-out for that window and then reflows. This reads the same
 * localStorage entry the SDK will restore from, so the first paint is already
 * right. It is a prediction only: AuthContext stays authoritative once loaded.
 */
function storageKey(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return null;
  try {
    // supabase-js default; lib/supabase.ts does not override storageKey
    return `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
  } catch {
    return null;
  }
}

let cachedRaw: string | null | undefined;
let cachedHint: AuthHint | null = null;

export function readAuthHint(key = storageKey()): AuthHint | null {
  if (!key) return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return null;
  }
  // useSyncExternalStore needs a stable snapshot for an unchanged value
  if (raw === cachedRaw) return cachedHint;
  cachedRaw = raw;
  cachedHint = parse(raw);
  return cachedHint;
}

function parse(raw: string | null): AuthHint | null {
  if (!raw) return null;
  try {
    const user = JSON.parse(raw)?.user;
    if (!user) return null;
    const meta = user.user_metadata ?? {};
    return {
      signedIn: !user.is_anonymous,
      name: meta.full_name ?? meta.name ?? null,
      email: user.email ?? null,
      avatarUrl: meta.avatar_url ?? meta.picture ?? null,
    };
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** Server snapshot is null so hydrating prerendered HTML never mismatches. */
export function useAuthHint(): AuthHint | null {
  return useSyncExternalStore(subscribe, () => readAuthHint(), () => null);
}

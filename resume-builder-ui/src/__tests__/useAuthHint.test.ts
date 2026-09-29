import { afterEach, describe, expect, it } from "vitest";
import { readAuthHint } from "../hooks/useAuthHint";

const KEY = "sb-test-auth-token";

describe("readAuthHint", () => {
  afterEach(() => localStorage.clear());

  it("returns null with no stored session", () => {
    expect(readAuthHint(KEY)).toBeNull();
  });

  it("reports an anonymous session as not signed in", () => {
    localStorage.setItem(KEY, JSON.stringify({ user: { is_anonymous: true } }));
    expect(readAuthHint(KEY)?.signedIn).toBe(false);
  });

  it("reports an OAuth user as signed in with their name", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        user: {
          is_anonymous: false,
          email: "a@b.co",
          user_metadata: { full_name: "Ada Lovelace", avatar_url: "https://x/a.png" },
        },
      })
    );
    expect(readAuthHint(KEY)).toEqual({
      signedIn: true,
      name: "Ada Lovelace",
      email: "a@b.co",
      avatarUrl: "https://x/a.png",
    });
  });

  it("returns null for malformed JSON", () => {
    localStorage.setItem(KEY, "{not json");
    expect(readAuthHint(KEY)).toBeNull();
  });
});

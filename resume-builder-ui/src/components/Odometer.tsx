import React, { useLayoutEffect, useState } from "react";
import { getResumeCount } from "../config/resumeCount";

// Mechanical-counter numerals. Each digit keeps its own glyph as DOM text and
// the rolling drum is a ::before (.odo-d in styles.css) that starts and ends on
// that same glyph — so prerender, no-JS, reduced motion and the settled roll
// all render identically, with nothing to hydrate. Right-hand columns spin more
// turns; left-hand columns land first, like a real odometer.
// `from` (same length) makes only the changed digits remount — keyed on their
// glyph — and roll forward one step from the old digit (--p) to the new one.
export const Odometer = ({ value, from, stale }: { value: string; from?: string; stale?: boolean }) => {
  const count = value.replace(/\D/g, "").length;
  const tick = from !== undefined && from.length === value.length;
  let k = 0;
  const cols = [...value].map((ch, i) => {
    if (!/\d/.test(ch)) return <span key={`s${i}`} className="odo-s">{ch}</span>;
    const fromRight = count - 1 - k++;
    const style = (tick && from[i] !== ch
      ? { "--n": ch, "--p": from[i], "--t": +(ch < from[i]), "--k": 0 }
      : { "--n": ch, "--t": 3 - Math.min(2, fromRight >> 1), "--k": k - 1 }) as unknown as React.CSSProperties;
    return <span key={`${i}${ch}`} className="odo-d" style={style}>{ch}</span>;
  });
  // The columns are separate boxes, so AT would read "1 5 0…"; role="img"
  // names the whole value once and keeps the DOM text single for crawlers.
  return (
    <span role="img" aria-label={value} data-stale={stale || undefined} className="odo" style={{ "--cols": count } as React.CSSProperties}>
      {cols}
    </span>
  );
};

/** Must match the userAgent set in scripts/prerender.ts. */
const PRERENDER_UA = "EasyFreeResume-Prerender";
const fmt = (n: number) => `${n.toLocaleString("en-US")}+`;

type CountState = { value: number; from?: number; stale: boolean };

// Live "Resumes Created" count. First render = the BUILD-date value, so it is
// byte-identical to the prerendered HTML (clean hydrateRoot); the layout effect
// swaps in the current value before paint, while CSS keeps the stale digits
// hidden ([data-stale]) until then, so JS visitors never see a jump. The
// prerender snapshot runs this bundle, so it must keep the build value.
export const ResumeCount = ({ bandRef }: { bandRef: React.RefObject<HTMLElement | null> }) => {
  const [c, setC] = useState<CountState>(() => ({ value: getResumeCount(Date.parse(__BUILD_DATE__)), stale: true }));

  useLayoutEffect(() => {
    if (navigator.userAgent.includes(PRERENDER_UA)) return;
    setC({ value: getResumeCount(Date.now()), stale: false });
    const id = setInterval(() => {
      setC((prev) => {
        const value = getResumeCount(Date.now());
        if (value === prev.value) return prev;
        // Roll only when someone can see it; otherwise swap silently
        const visible = !document.hidden && !!bandRef.current?.classList.contains("revealed");
        return { value, from: visible ? prev.value : undefined, stale: false };
      });
    }, 60_000);
    return () => clearInterval(id);
  }, [bandRef]);

  return <Odometer value={fmt(c.value)} from={c.from === undefined ? undefined : fmt(c.from)} stale={c.stale} />;
};

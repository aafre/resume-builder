import React from "react";

// Mechanical-counter numerals. Each digit keeps its own glyph as DOM text and
// the rolling drum is a ::before (.odo-d in styles.css) that starts and ends on
// that same glyph — so prerender, no-JS, reduced motion and the settled roll
// all render identically, with nothing to hydrate. Right-hand columns spin more
// turns; left-hand columns land first, like a real odometer.
// `from` (same length) makes only the changed digits remount — keyed on their
// glyph — and roll forward one step from the old digit (--p) to the new one.
export const Odometer = ({ value, from }: { value: string; from?: string }) => {
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
    <span role="img" aria-label={value} className="odo" style={{ "--cols": count } as React.CSSProperties}>
      {cols}
    </span>
  );
};


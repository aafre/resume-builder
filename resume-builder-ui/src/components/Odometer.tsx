import React from "react";

// Mechanical-counter numerals. Each digit keeps its own glyph as DOM text and
// the rolling drum is a ::before (.odo-d in styles.css) that starts and ends on
// that same glyph — so prerender, no-JS, reduced motion and the settled roll
// all render identically, with nothing to hydrate. Right-hand columns spin more
// turns; left-hand columns land first, like a real odometer.
// "∞" is a drum too: it spins three full turns of 0–9 and lands past the
// digits, on the glyph the counter can't count to (.odo-inf strip).
const isDrum = (ch: string) => /\d/.test(ch) || ch === "∞";

export const Odometer = ({ value }: { value: string }) => {
  const count = [...value].filter(isDrum).length;
  let k = 0;
  const cols = [...value].map((ch, i) => {
    if (!isDrum(ch)) return <span key={`s${i}`} className="odo-s">{ch}</span>;
    const fromRight = count - 1 - k++;
    const inf = ch === "∞";
    const style = (inf
      ? { "--n": 0, "--t": 3, "--k": k - 1 }
      : { "--n": ch, "--t": 3 - Math.min(2, fromRight >> 1), "--k": k - 1 }) as unknown as React.CSSProperties;
    return <span key={`${i}${ch}`} className={inf ? "odo-d odo-inf" : "odo-d"} style={style}>{ch}</span>;
  });
  // The columns are separate boxes, so AT would read "1 0 0 %"; role="img"
  // names the whole value once and keeps the DOM text single for crawlers.
  return (
    <span role="img" aria-label={value} className="odo" style={{ "--cols": count } as React.CSSProperties}>
      {cols}
    </span>
  );
};

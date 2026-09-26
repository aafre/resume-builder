import type React from "react";

/**
 * Desktop nav glyphs. Each one draws what the destination does, and on
 * hover/focus performs that verb once (motion lives in styles.css under
 * `.nav-glyph`). `.g-accent` is the one shape that fills Signal Green on the
 * current page — fill only, the ink stroke carries the contrast.
 */
type GlyphProps = { className?: string };

function Glyph({ className, children }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`nav-glyph ${className ?? ""}`}
    >
      {children}
    </svg>
  );
}

/** Two layouts, the back one fans out: "pick a design". */
const TemplatesGlyph = ({ className }: GlyphProps) => (
  <Glyph className={className}>
    <rect className="g-fan" x="8" y="2.75" width="12" height="15" rx="2" />
    <rect x="4" y="6.25" width="12" height="15" rx="2" fill="#fff" />
    <path d="M7 9.75h6" />
    <rect className="g-accent" x="7" y="12.75" width="6" height="5.5" rx="1" />
  </Glyph>
);

/** A page that writes itself: "see one done". */
const ExamplesGlyph = ({ className }: GlyphProps) => (
  <Glyph className={className}>
    <rect x="4.5" y="2.75" width="15" height="18.5" rx="2" />
    <rect className="g-accent" x="7.75" y="6" width="5" height="3" rx="1" />
    <path className="g-write" pathLength={1} d="M7.75 12.25h8.5" />
    <path className="g-write g-write-2" pathLength={1} d="M7.75 15.25h8.5" />
    <path className="g-write g-write-3" pathLength={1} d="M7.75 18.25h5" />
  </Glyph>
);

/** A page in a viewfinder, crossed by a beam: "check it". */
const ScannerGlyph = ({ className }: GlyphProps) => (
  <Glyph className={className}>
    <path d="M3 7.5V5a2 2 0 0 1 2-2h2.5M16.5 3H19a2 2 0 0 1 2 2v2.5M21 16.5V19a2 2 0 0 1-2 2h-2.5M7.5 21H5a2 2 0 0 1-2-2v-2.5" />
    <path d="M8 8h8M8 16h5" />
    <path className="g-beam g-accent-stroke" d="M5.5 12h13" />
  </Glyph>
);

/** A briefcase with a spark: "matched openings". */
const JobsGlyph = ({ className }: GlyphProps) => (
  <Glyph className={className}>
    <rect x="2.75" y="8" width="15" height="12" rx="2" />
    <path d="M7.25 8V6.5A1.5 1.5 0 0 1 8.75 5h3a1.5 1.5 0 0 1 1.5 1.5V8M2.75 13.25h15" />
    <path
      className="g-spark g-accent"
      strokeWidth={1.25}
      d="M19.5 1.75l.95 2.3 2.3.95-2.3.95-.95 2.3-.95-2.3-2.3-.95 2.3-.95z"
    />
  </Glyph>
);

/** Your stack of saved resumes; the top one lifts. */
const MyResumesGlyph = ({ className }: GlyphProps) => (
  <Glyph className={className}>
    <path className="g-peek" d="M8 3.25h9a2 2 0 0 1 2 2v12" />
    <g className="g-lift">
      <rect x="4.5" y="6.25" width="11.5" height="15" rx="2" fill="#fff" />
      <rect className="g-accent" x="7.25" y="9.25" width="4.5" height="2.75" rx="0.75" />
      <path d="M7.25 15h6M7.25 18h4" />
    </g>
  </Glyph>
);

/** An open book whose pages turn: "read the guides". */
const BlogGlyph = ({ className }: GlyphProps) => (
  <Glyph className={className}>
    <path d="M12 6.5C10.5 5 8 4.25 3.5 4.25v14.5c4.5 0 7 .75 8.5 2.25 1.5-1.5 4-2.25 8.5-2.25V4.25C16 4.25 13.5 5 12 6.5z" />
    <path d="M12 6.5V21" />
    <path className="g-write" pathLength={1} d="M6 8.5c1.75 0 3 .25 3.75.75" />
    <path className="g-write g-write-2" pathLength={1} d="M6 12c1.75 0 3 .25 3.75.75" />
    <rect className="g-accent" x="14.25" y="8" width="3.75" height="4.5" rx="0.75" />
  </Glyph>
);

export const navGlyphs: Record<string, (props: GlyphProps) => React.ReactElement> = {
  "/templates": TemplatesGlyph,
  "/examples": ExamplesGlyph,
  "/resume-keyword-scanner": ScannerGlyph,
  "/jobs": JobsGlyph,
  "/my-resumes": MyResumesGlyph,
  "/blog": BlogGlyph,
};

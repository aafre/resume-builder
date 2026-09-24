import { useEffect, useRef, useState } from 'react';

interface Heading {
  id: string;
  text: string;
}

/** A rail with fewer entries than this is navigation nobody needs. */
const MIN_HEADINGS = 3;

function slugify(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return base ? `${base}-${index}` : `section-${index}`;
}

/**
 * Table of contents for a blog post, derived from the article's own <h2>
 * elements at mount — nothing is passed in, so none of the 50 post components
 * had to be touched and no content moved to make this work.
 *
 * Rendered in the left gutter above 1360px only; `.article-rail` hides it
 * everywhere else, and it is absolutely positioned so it can never shift the
 * article column.
 */
export default function ArticleRail({
  bodyRef,
}: {
  bodyRef: React.RefObject<HTMLElement>;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [marker, setMarker] = useState({ y: 0, h: 0 });
  const listRef = useRef<HTMLUListElement>(null);

  // Collect the headings and give them ids so the rail has something to link
  // to. Existing ids are left alone.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const found = Array.from(body.querySelectorAll('h2')).map((el, i) => {
      const text = el.textContent?.trim() ?? '';
      if (!el.id) el.id = slugify(text, i);
      return { id: el.id, text };
    });

    setHeadings(found.length >= MIN_HEADINGS ? found : []);
  }, [bodyRef]);

  // Scroll-spy. The active entry is the last heading to have crossed the line
  // just under the sticky header — a position test, not a "is it inside a
  // band" test. A band narrow enough to name one heading is usually empty,
  // which left nothing active for most of the page.
  //
  // The observer's top margin is that same line, so it fires exactly when a
  // heading crosses it and nowhere else. Same bail-out as useScrollReveal:
  // no observer in jsdom or during prerender.
  useEffect(() => {
    if (headings.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const LINE = 140; // sticky header + a little breathing room

    const pick = () => {
      let current = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= LINE) current = h.id;
      }
      setActiveId(current);
    };

    const observer = new IntersectionObserver(pick, {
      rootMargin: `-${LINE}px 0px 0px 0px`,
    });

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    pick(); // seed, so the rail is never blank on load
    return () => observer.disconnect();
  }, [headings]);

  // Measure in an effect rather than during render, and re-measure on resize —
  // the entries wrap, so a narrower rail changes every offset below the fold.
  useEffect(() => {
    const measure = () => {
      const index = headings.findIndex((h) => h.id === activeId);
      const el = listRef.current?.children[index] as HTMLElement | undefined;
      setMarker(el ? { y: el.offsetTop, h: el.offsetHeight } : { y: 0, h: 0 });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeId, headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="article-rail" aria-label="On this page">
      <div className="article-rail-inner">
        <span className="font-mono text-[10px] tracking-[0.15em] text-ink/60 uppercase block mb-3">
          Contents
        </span>
        <div className="article-rail-list">
          <span
            className="article-rail-marker"
            aria-hidden="true"
            style={
              {
                '--rail-y': `${marker.y}px`,
                '--rail-h': `${marker.h}px`,
              } as React.CSSProperties
            }
          />
          <ul ref={listRef}>
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="article-rail-link"
                  aria-current={h.id === activeId ? 'true' : undefined}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

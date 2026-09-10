/**
 * LegalDocument — the reading surface for /privacy-policy and /terms-of-service
 *
 * Both pages were the last two on the site that had never been migrated at all:
 * `container mx-auto`, an `<h1>` at `text-3xl font-bold`, every section head an
 * `<h4>` because the size happened to look right, and the whole document in one
 * `bg-white p-6 rounded-lg shadow-lg` slab with no measure constraint. On a
 * desktop that put legal prose on a 1100px line with no way to find anything
 * in it.
 *
 * These are Read surfaces, so the work is comprehension, not expression: a
 * constrained measure, real heading levels, numbered sections, and a contents
 * rail that tracks where you are. The rail is the second thing worth having
 * here — a nine-section policy is a document people arrive at looking for one
 * clause, and scrolling past eight to find it is the whole complaint.
 *
 * The rail is an IntersectionObserver rather than a scroll handler, it is
 * `<nav>` with an aria-current, and below lg it collapses into a native
 * `<details>` so there is no custom disclosure to keyboard-trap.
 */

import { useEffect, useState, type ReactNode } from 'react';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalDocumentProps {
  title: string;
  /** Rendered under the H1 as the document's own metadata line. */
  lastUpdated: string;
  intro?: ReactNode;
  sections: LegalSection[];
}

export default function LegalDocument({
  title,
  lastUpdated,
  intro,
  sections,
}: LegalDocumentProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    /* The band is the top fifth of the viewport: a heading is "current" once it
       has reached the reading position, not when it first appears at the
       bottom. Without the negative bottom inset every section below the fold
       counts as intersecting and the rail sits on the last one. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const contents = (
    <ol className="space-y-1">
      {sections.map((section, i) => {
        const current = section.id === activeId;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={current ? 'true' : undefined}
              className={`flex items-baseline gap-3 py-2 pl-3 -ml-px border-l-2 text-sm transition-colors duration-200 rounded-r focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text ${
                current
                  ? 'border-accent-text text-ink font-medium'
                  : 'border-ink/10 text-ink/60 hover:text-ink hover:border-ink/30'
              }`}
            >
              <span className="font-mono text-xs tabular-nums flex-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="bg-chalk">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="mb-12 md:mb-16 max-w-3xl">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
            Legal
          </p>
          <h1 className="font-display text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight text-ink mb-5 [text-wrap:balance]">
            {title}
          </h1>
          <p className="font-mono text-xs tracking-[0.12em] uppercase text-ink/60">
            Last updated {lastUpdated}
          </p>
          {intro && (
            <div className="mt-8 text-lg font-extralight text-ink/60 leading-relaxed [text-wrap:pretty]">
              {intro}
            </div>
          )}
        </header>

        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          {/* Contents. Sticky under the fixed header on desktop; a native
              disclosure on narrow screens, closed by default so it costs a
              phone reader nothing. */}
          <nav aria-label="Contents" className="mb-10 lg:mb-0">
            <details className="lg:hidden bg-chalk-dark rounded-xl px-5 py-4">
              <summary className="font-mono text-xs tracking-[0.15em] uppercase text-ink cursor-pointer min-h-11 flex items-center">
                Contents
              </summary>
              <div className="mt-4">{contents}</div>
            </details>
            <div className="hidden lg:block sticky top-[calc(var(--header-height-desktop)+2rem)]">
              <p className="font-mono text-xs tracking-[0.15em] uppercase text-ink/60 mb-4">
                Contents
              </p>
              {contents}
            </div>
          </nav>

          {/* `legal-prose` in styles.css carries the inline rules — links,
              lists, <strong> — so the section bodies below stay plain JSX. */}
          <div className="legal-prose max-w-[68ch]">
            {sections.map((section, i) => (
              <section key={section.id} className="pt-10 first:pt-0">
                <h2
                  id={section.id}
                  className="font-display text-2xl font-extrabold tracking-tight text-ink mb-4 scroll-mt-[calc(var(--header-height-desktop)+2rem)]"
                >
                  <span className="font-mono text-sm text-accent-text tabular-nums mr-3 align-middle">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                {section.body}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

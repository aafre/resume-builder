/**
 * AtsParseDemo — the ATS cluster's one authored moment
 *
 * The argument these pages exist to make is that a graphic-heavy template
 * arrives at the recruiter as garbage. It was previously made with two static
 * white cards side by side, each holding a block of pre-garbled mono text: the
 * claim asserted twice rather than demonstrated once, and the comparison left
 * for the reader to run.
 *
 * Here it is one machine. A sheet goes in, a scan runs down it, and the parse
 * comes out on the right in the order the scan reaches it. Switching the
 * segmented control swaps the sheet's *layout* — single column against a
 * sidebar-and-columns design — and the readout changes with it, so the reader
 * sees the same content produce two different outputs and can attribute the
 * difference to the one thing that changed.
 *
 * The sheets are authored SVG rather than screenshots on purpose: the subject
 * is document structure, so structure is the only thing that should be drawn.
 * A real preview would put typography and colour in front of the variable.
 *
 * Motion is `view()`-driven, matching the step rail; there is no scroll
 * listener. Without scroll timelines the parse is simply already written and
 * the scan never appears, which is the composed static page.
 *
 * Polarity: this sits in an ink band. Copy is white / white/60, the eyebrow and
 * numerals are `text-accent` (9.98:1 on ink), and the readout's `bg-white/5`
 * composites to #252525 where white/60 still measures 6.43:1.
 */

import { useId, useState } from 'react';
import Band from './Band';
import RevealSection from './RevealSection';

type Variant = 'ats' | 'graphic';

interface Sample {
  label: string;
  /** Lines as the parser recovers them; `indent` marks a nested field. */
  lines: { text: string; indent?: boolean; broken?: boolean }[];
  verdict: string;
  verdictTone: 'pass' | 'fail';
}

const SAMPLES: Record<Variant, Sample> = {
  ats: {
    label: 'ATS-Friendly Template',
    lines: [
      { text: 'Name: John Smith' },
      { text: 'Title: Software Engineer' },
      { text: 'Experience:' },
      { text: 'Senior Developer, Acme Corp', indent: true },
      { text: 'Jan 2022 - Present', indent: true },
      { text: '- Led team of 5 engineers...', indent: true },
      { text: 'Skills: Python, React, AWS' },
    ],
    verdict: 'Result: Correctly parsed, ranked by keywords',
    verdictTone: 'pass',
  },
  graphic: {
    label: 'Graphic-Heavy Template',
    lines: [
      { text: 'John SmithSoftware Engineer' },
      { text: 'Senior Developer Acme CorpJan' },
      { text: '2022PresentLed team of 5' },
      { text: 'engineersPythonReactAWS' },
      { text: '[image] [image] [table error]', broken: true },
    ],
    verdict: 'Result: Garbled text, low keyword score, auto-rejected',
    verdictTone: 'fail',
  },
};

/* ── The sheets ──
   Both drawn on the same 340×440 field (8.5:11) so the swap reads as one page
   being re-laid-out rather than two unrelated pictures. Rules are ink at low
   alpha; nothing here is text, so none of it is held to a text ratio. */

const rule = 'rgba(12,12,12,0.16)';
const solid = 'rgba(12,12,12,0.55)';

function AtsSheet() {
  const line = (y: number, w: number, k: string) => (
    <rect key={k} x={40} y={y} width={w} height={5} rx={2.5} fill={rule} />
  );
  return (
    <svg viewBox="0 0 340 440" className="w-full h-full" role="presentation">
      <rect width="340" height="440" fill="#ffffff" />
      {/* Name and contact, centred, full measure — the header an ATS expects */}
      <rect x={110} y={38} width={120} height={12} rx={3} fill={solid} />
      <rect x={92} y={60} width={156} height={5} rx={2.5} fill={rule} />
      {[110, 200, 290].map((top, s) => (
        <g key={top}>
          {/* Section heading + its rule */}
          <rect x={40} y={top} width={78} height={7} rx={3} fill={solid} />
          <rect x={40} y={top + 15} width={260} height={1} fill={rule} />
          {[0, 1, 2].map((i) => line(top + 28 + i * 14, i === 2 ? 190 : 260, `${s}-${i}`))}
        </g>
      ))}
    </svg>
  );
}

function GraphicSheet() {
  return (
    <svg viewBox="0 0 340 440" className="w-full h-full" role="presentation">
      <rect width="340" height="440" fill="#ffffff" />
      {/* Dark sidebar — the single most common reason a parse collapses */}
      <rect width="118" height="440" fill="#2b2f38" />
      <circle cx={59} cy={62} r={28} fill="rgba(255,255,255,0.28)" />
      {[120, 138, 156, 174].map((y, i) => (
        <rect
          key={y}
          x={22}
          y={y}
          width={i === 3 ? 46 : 74}
          height={5}
          rx={2.5}
          fill="rgba(255,255,255,0.3)"
        />
      ))}
      {/* Skill meters: bars, which arrive as nothing at all */}
      {[210, 232, 254, 276].map((y, i) => (
        <g key={y}>
          <rect x={22} y={y} width={74} height={6} rx={3} fill="rgba(255,255,255,0.16)" />
          <rect
            x={22}
            y={y}
            width={[62, 44, 70, 36][i]}
            height={6}
            rx={3}
            fill="rgba(0,212,126,0.75)"
          />
        </g>
      ))}
      {/* Boxed header on the right — a text box, not a heading */}
      <rect
        x={140}
        y={34}
        width={168}
        height={54}
        rx={6}
        fill="none"
        stroke={rule}
        strokeWidth={2}
      />
      <rect x={156} y={50} width={104} height={10} rx={3} fill={solid} />
      <rect x={156} y={68} width={80} height={5} rx={2.5} fill={rule} />
      {/* Two columns of body copy, which interleave when read linearly */}
      {[0, 1].map((col) =>
        [0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={`${col}-${i}`}
            x={140 + col * 88}
            y={116 + i * 14}
            width={i % 3 === 2 ? 52 : 74}
            height={5}
            rx={2.5}
            fill={rule}
          />
        ))
      )}
      {/* Icon row */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={156 + i * 44} cy={240} r={13} fill="rgba(12,12,12,0.12)" />
      ))}
      {/* A table, drawn as a table */}
      <g stroke={rule} strokeWidth={1} fill="none">
        <rect x={140} y={280} width={168} height={110} rx={4} />
        <path d="M140 316h168M140 352h168M196 280v110M252 280v110" />
      </g>
    </svg>
  );
}

export default function AtsParseDemo() {
  const [variant, setVariant] = useState<Variant>('ats');
  const sample = SAMPLES[variant];
  const panelId = useId();

  return (
    <Band tone="ink" reveal={false} reserve="cv-h-800">
      <RevealSection className="text-center mb-10 md:mb-12">
        <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
          The same resume, twice
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          ATS-friendly vs. non-ATS templates: what happens
        </h2>
        <p className="text-lg md:text-xl font-extralight text-white/60 max-w-3xl mx-auto leading-relaxed mt-5">
          Switch the layout and watch the parse change. Nothing else about the
          document is different.
        </p>
      </RevealSection>

      {/* Segmented control. Two real buttons in a radiogroup rather than a
          styled select: there are exactly two states and both are worth
          showing as targets. */}
      <div className="flex justify-center mb-10">
        <div
          className="ats-toggle inline-flex rounded-lg p-1 gap-1"
          role="radiogroup"
          aria-label="Template layout"
        >
          {(Object.keys(SAMPLES) as Variant[]).map((key) => {
            const selected = key === variant;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-controls={panelId}
                onClick={() => setVariant(key)}
                className={`min-h-11 px-4 sm:px-6 rounded-md text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                  selected
                    ? 'bg-white text-ink'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {SAMPLES[key].label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={panelId}
        className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-5xl mx-auto"
      >
        {/* Left: what you upload */}
        <figure className="m-0">
          <figcaption className="font-mono text-[11px] tracking-[0.15em] text-white/60 uppercase mb-3">
            What you upload
          </figcaption>
          <div className="ats-sheet aspect-[8.5/11] rounded-xl bg-white ring-1 ring-white/10 shadow-2xl">
            {variant === 'ats' ? <AtsSheet /> : <GraphicSheet />}
            <span className="ats-scan" aria-hidden="true" />
          </div>
        </figure>

        {/* Right: what comes out */}
        <figure className="m-0">
          <figcaption className="font-mono text-[11px] tracking-[0.15em] text-white/60 uppercase mb-3">
            What the ATS sees
          </figcaption>
          <div className="ats-readout rounded-xl bg-white/5 ring-1 ring-white/10 p-5 sm:p-6 font-mono text-sm leading-relaxed min-h-[220px]">
            {sample.lines.map((l, i) => (
              <p
                key={`${variant}-${i}`}
                className={`ats-line ${l.indent ? 'pl-5' : ''} ${
                  l.broken ? 'text-rose-300' : 'text-white/60'
                }`}
                style={{ '--i': i } as React.CSSProperties}
              >
                {l.text}
              </p>
            ))}
          </div>
          <p
            className={`mt-4 text-sm font-medium ${
              sample.verdictTone === 'pass' ? 'text-accent' : 'text-rose-300'
            }`}
          >
            {sample.verdict}
          </p>
        </figure>
      </div>
    </Band>
  );
}

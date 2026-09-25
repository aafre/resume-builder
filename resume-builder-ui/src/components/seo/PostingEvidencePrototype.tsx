// PROTOTYPE, throwaway, prototype/r1-posting-evidence branch only.
// Question: how should posting evidence appear on a role page?
// Three variants on the existing /examples/:slug route, switched via ?variant=A|B|C.
// Stub data: the verified FDE postings from "Verify R1 posting evidence" (2026-09-24 ledger).
import { useState } from 'react';
import PrototypeSwitcher, { usePrototypeVariant } from '../shared/PrototypeSwitcher';

type Posting = {
  id: string;
  employer: string;
  title: string;
  location: string;
  url: string;
  checked: string;
  status: 'live' | 'closed';
  supports: string;
};

const POSTINGS: Posting[] = [
  { id: 'F1', employer: 'OpenAI', title: 'Forward Deployed Engineer (FDE)', location: 'San Francisco', url: 'https://jobs.ashbyhq.com/openai/967f94aa-1706-4dba-ac89-bfbc2c38b688', checked: '2026-09-24', status: 'live', supports: 'Discovery → scoping → build → production rollout with customers; evals; full-stack; Python' },
  { id: 'F2', employer: 'Anthropic', title: 'Forward Deployed Engineer', location: 'London', url: 'https://job-boards.greenhouse.io/anthropic/jobs/5423029008', checked: '2026-09-24', status: 'live', supports: 'Production Claude apps inside customer systems; prompts; agents; evals; Python (TS/Java optional)' },
  { id: 'F3', employer: 'Palantir', title: 'Forward Deployed AI Engineer', location: 'London', url: 'https://jobs.lever.co/palantir/ff1029bd-bb6d-4d78-a03e-5f9744d0b798', checked: '2026-09-24', status: 'live', supports: 'Customer GenAI strategy and implementation; LLM workflows to production; field feedback into product' },
  // Fallback demo: what a posting that closed after publication looks like.
  { id: 'X1', employer: 'Example Co', title: 'Forward Deployed Engineer', location: 'Remote', url: '#', checked: '2026-08-01', status: 'closed', supports: 'Customer onboarding; integrations' },
];

const KEYWORDS: { term: string; ids: string[] }[] = [
  { term: 'Python', ids: ['F1', 'F2', 'F3'] },
  { term: 'Production deployment', ids: ['F1', 'F2', 'F3'] },
  { term: 'Customer discovery', ids: ['F1', 'F2'] },
  { term: 'Evals / evaluation', ids: ['F1', 'F2'] },
  { term: 'Stakeholder communication', ids: ['F1', 'F2'] },
  { term: 'LLM applications', ids: ['F2', 'F3'] },
  { term: 'TypeScript', ids: ['F2', 'F3'] },
  { term: 'Java', ids: ['F2', 'F3'] },
  { term: 'Full-stack', ids: ['F1'] },
  { term: 'Prompt engineering', ids: ['F2'] },
  { term: 'Agents', ids: ['F2'] },
  { term: 'Product feedback loop', ids: ['F3'] },
];

const LIVE = POSTINGS.filter((p) => p.status === 'live');
const byId = (id: string) => POSTINGS.find((p) => p.id === id)!;
const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const VARIANTS = [
  { key: 'A', name: 'Evidence table section' },
  { key: 'B', name: 'Keyword provenance chips' },
  { key: 'C', name: 'Hero trust strip' },
];

/** Variant A: a dedicated section with a full evidence table, below skills. */
function VariantA() {
  return (
    <section className="my-16 max-w-5xl mx-auto">
      <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">Evidence</span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-3 text-center">Built from real job postings</h2>
      <p className="text-center font-extralight text-ink/60 mb-8 max-w-2xl mx-auto">
        Every skill and keyword on this page comes from these postings. We re-check them when the page is updated.
      </p>
      <div className="overflow-x-auto bg-white rounded-xl border border-black/[0.06]">
        <table className="w-full text-sm text-left">
          <thead className="text-ink/60 font-mono text-xs uppercase tracking-wider">
            <tr><th className="p-3">Employer</th><th className="p-3">Posting</th><th className="p-3">What it asks for</th><th className="p-3">Checked</th></tr>
          </thead>
          <tbody>
            {POSTINGS.map((p) => (
              <tr key={p.id} className={`border-t border-black/[0.06] ${p.status === 'closed' ? 'text-ink/40' : 'text-ink/80'}`}>
                <td className="p-3 font-bold">{p.employer}</td>
                <td className="p-3">
                  {p.status === 'live'
                    ? <a href={p.url} rel="nofollow noopener" target="_blank" className="underline text-accent-text">{p.title}</a>
                    : <span className="line-through">{p.title}</span>}
                  <div className="text-xs text-ink/50">{p.location}{p.status === 'closed' && ' · closed since last check'}</div>
                </td>
                <td className="p-3 font-extralight">{p.supports}</td>
                <td className="p-3 whitespace-nowrap font-mono text-xs">{fmt(p.checked)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Variant B: no separate section; the keyword list itself shows which postings back each term. */
function VariantB() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="my-16 max-w-4xl mx-auto">
      <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">What employers ask for</span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8 text-center">Keywords, and where they come from</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {KEYWORDS.map((k) => (
          <button
            key={k.term}
            onClick={() => setOpen(open === k.term ? null : k.term)}
            className={`rounded-full border px-3 py-1.5 text-sm ${open === k.term ? 'bg-ink text-white border-ink' : 'bg-white border-black/10 text-ink/80'}`}
          >
            {k.term} <span className="font-mono text-xs opacity-60">{k.ids.length}/{LIVE.length}</span>
          </button>
        ))}
      </div>
      {open && (
        <div className="mt-6 bg-white rounded-xl border border-black/[0.06] p-5 text-sm">
          <p className="font-bold text-ink mb-2">"{open}" appears in:</p>
          <ul className="space-y-1">
            {KEYWORDS.find((k) => k.term === open)!.ids.map((id) => {
              const p = byId(id);
              return <li key={id}><a href={p.url} target="_blank" rel="nofollow noopener" className="underline text-accent-text">{p.employer}: {p.title}</a> <span className="text-ink/50">({p.location}, checked {fmt(p.checked)})</span></li>;
            })}
          </ul>
        </div>
      )}
      <p className="mt-6 text-center text-xs text-ink/60">
        Counts show how many of {LIVE.length} live postings mention the term. A term in 1 posting is employer-specific, not a must-have.
      </p>
    </section>
  );
}

/** Variant C: a one-line trust strip under the answer block; details collapsed. Nothing lower on the page. */
export function PostingEvidenceHero() {
  const v = usePrototypeVariant(VARIANTS.map((x) => x.key));
  if (v !== 'C') return null;
  return (
    <details className="mt-5 max-w-3xl text-sm text-ink/70 border-l-2 border-accent-text pl-4">
      <summary className="cursor-pointer">
        Based on <strong>{LIVE.length} live job postings</strong> ({LIVE.map((p) => p.employer).join(', ')}), checked {fmt(LIVE[0].checked)}. <span className="underline">Sources</span>
      </summary>
      <ul className="mt-3 space-y-1.5">
        {POSTINGS.map((p) => (
          <li key={p.id} className={p.status === 'closed' ? 'text-ink/40 line-through' : ''}>
            {p.status === 'live' ? <a href={p.url} target="_blank" rel="nofollow noopener" className="underline text-accent-text">{p.employer}: {p.title}</a> : `${p.employer}: ${p.title} (closed)`}
            <span className="text-ink/50"> · {p.location}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Mounted below the skills section; renders A or B, plus the switcher. */
export function PostingEvidenceBody() {
  const v = usePrototypeVariant(VARIANTS.map((x) => x.key));
  return (
    <>
      {v === 'A' && <VariantA />}
      {v === 'B' && <VariantB />}
      <PrototypeSwitcher variants={VARIANTS} />
    </>
  );
}

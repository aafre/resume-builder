/**
 * Posting evidence for role pages (Role batch R1): a trust line under the
 * answer block, and an evidence table after the skills section.
 *
 * Text only, by rule: no hyperlinks to postings anywhere. Postings close, and
 * their URLs live in the evidence ledger, not on the page. Both blocks use
 * native markup (<details>, <table>) so all content is in the prerendered HTML.
 */

import type { EvidencePosting, PostingEvidence } from '../../data/jobExamples/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09" → "Sep 2026". String split, not Date, so no timezone can shift the month. */
export function formatAsOf(asOf: string): string {
  const [year, month] = asOf.split('-');
  return `${MONTHS[Number(month) - 1] ?? month} ${year}`;
}

/** Postings grouped by `group`, main role (no group) first, then groups in first-seen order. */
export function groupPostings(postings: EvidencePosting[]): [string | undefined, EvidencePosting[]][] {
  const groups = new Map<string | undefined, EvidencePosting[]>([[undefined, []]]);
  for (const p of postings) {
    if (!groups.has(p.group)) groups.set(p.group, []);
    groups.get(p.group)!.push(p);
  }
  return [...groups].filter(([, list]) => list.length > 0);
}

/** How many postings in the list mention each skill, sorted by count desc (ties keep first-seen order). */
export function skillCounts(postings: EvidencePosting[]): { skill: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of postings) {
    for (const skill of new Set(p.skills)) counts.set(skill, (counts.get(skill) ?? 0) + 1);
  }
  return [...counts].map(([skill, count]) => ({ skill, count })).sort((a, b) => b.count - a.count);
}

const mainPostings = (evidence: PostingEvidence) => evidence.postings.filter((p) => !p.group);

/** "Based on 3 job postings (OpenAI, Anthropic, Palantir), as seen Sep 2026." Main-role postings only. */
export function PostingTrustLine({ evidence }: { evidence?: PostingEvidence }) {
  const postings = evidence ? mainPostings(evidence) : [];
  if (!evidence || postings.length === 0) return null;
  const employers = [...new Set(postings.map((p) => p.employer))].join(', ');

  return (
    <details data-testid="posting-trust-line" className="mt-4 max-w-3xl text-sm text-ink/60">
      <summary className="cursor-pointer font-mono text-xs tracking-[0.08em] underline decoration-dotted underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text rounded-sm">
        Based on {postings.length} job {postings.length === 1 ? 'posting' : 'postings'} ({employers}), as seen{' '}
        {formatAsOf(evidence.asOf)}.
      </summary>
      <ul className="mt-3 space-y-1 pl-4">
        {postings.map((p, i) => (
          <li key={i}>
            <span className="text-ink">{p.employer}</span> &middot; {p.title} &middot; {p.location}
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Employer · Posting · What it asks for, one labelled sub-group per role variant, with per-group skill counts. */
export function PostingEvidenceTable({ evidence, roleTitle }: { evidence?: PostingEvidence; roleTitle: string }) {
  if (!evidence || evidence.postings.length === 0) return null;
  const groups = groupPostings(evidence.postings);
  const labelled = groups.length > 1;

  return (
    <section data-testid="posting-evidence" className="my-16 max-w-5xl mx-auto">
      <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
        Posting Evidence
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8 text-center">
        What {roleTitle} Job Postings Ask For
      </h2>
      <div className="overflow-x-auto bg-white rounded-xl border border-black/[0.06]">
        <table className="w-full text-sm text-left">
          <thead className="bg-chalk-dark text-ink">
            <tr>
              <th scope="col" className="px-5 py-3 font-bold">Employer</th>
              <th scope="col" className="px-5 py-3 font-bold">Posting</th>
              <th scope="col" className="px-5 py-3 font-bold">What it asks for</th>
            </tr>
          </thead>
          {groups.map(([group, postings]) => (
            <tbody key={group ?? 'main'}>
              {labelled && (
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={3}
                    className="px-5 pt-5 pb-2 font-mono text-[0.6875rem] tracking-[0.15em] uppercase text-accent-text border-t border-black/[0.06]"
                  >
                    {group ?? roleTitle} postings
                  </th>
                </tr>
              )}
              {postings.map((p, i) => (
                <tr key={i} className="border-t border-black/[0.06] align-top">
                  <td className="px-5 py-3 font-semibold text-ink whitespace-nowrap">{p.employer}</td>
                  <td className="px-5 py-3 text-ink/75">
                    {p.title}
                    <span className="block text-xs text-ink/60">{p.location}</span>
                  </td>
                  <td className="px-5 py-3 text-ink/75">{p.asks}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <div className="mt-5 space-y-2">
        {groups.map(([group, postings]) => (
          <p key={group ?? 'main'} data-testid="skill-counts" className="text-sm text-ink/75">
            {labelled && <span className="font-semibold text-ink">{group ?? roleTitle}: </span>}
            {skillCounts(postings)
              .map(({ skill, count }) => `${skill} ${count}/${postings.length}`)
              .join(' · ')}
          </p>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink/60">
        Snapshot of real postings as seen {formatAsOf(evidence.asOf)}. Postings close; the skills they asked for are
        what this page is built on.
      </p>
    </section>
  );
}

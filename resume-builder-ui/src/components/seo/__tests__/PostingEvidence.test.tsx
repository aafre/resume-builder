import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostingTrustLine, PostingEvidenceTable, formatAsOf, skillCounts } from '../PostingEvidence';
import type { PostingEvidence } from '../../../data/jobExamples/types';

// Fictional fixture: shape only, not real postings.
const evidence: PostingEvidence = {
  asOf: '2026-09',
  postings: [
    { employer: 'Acme', title: 'Widget Engineer', location: 'London', asks: 'Ship widgets', skills: ['Python', 'Evals'] },
    { employer: 'Globex', title: 'Widget Engineer II', location: 'Remote (EU/UK)', asks: 'Scale widgets', skills: ['Python', 'Kubernetes'] },
    { employer: 'Initech', title: 'Senior Widget Engineer', location: 'San Francisco', asks: 'Own widgets', skills: ['Python', 'Evals', 'Python'] },
    { employer: 'Umbrella', title: 'Platform Engineer', location: 'Tokyo', asks: 'Run platforms', skills: ['Kubernetes'], group: 'Platform Engineer' },
    { employer: 'Hooli', title: 'AI Platform Engineer', location: 'Remote (EU/UK)', asks: 'Build platforms', skills: ['Terraform', 'Kubernetes'], group: 'Platform Engineer' },
  ],
};

describe('formatAsOf', () => {
  it('renders YYYY-MM as "Mon YYYY"', () => {
    expect(formatAsOf('2026-09')).toBe('Sep 2026');
    expect(formatAsOf('2027-01')).toBe('Jan 2027');
  });
});

describe('skillCounts', () => {
  it('counts each skill once per posting, sorted by count desc', () => {
    expect(skillCounts(evidence.postings.slice(0, 3))).toEqual([
      { skill: 'Python', count: 3 },
      { skill: 'Evals', count: 2 },
      { skill: 'Kubernetes', count: 1 },
    ]);
  });
});

describe('PostingTrustLine', () => {
  it('counts main-role postings only and lists them inside <details>', () => {
    render(<PostingTrustLine evidence={evidence} />);
    const block = screen.getByTestId('posting-trust-line');
    expect(block.tagName).toBe('DETAILS');
    expect(block.querySelector('summary')?.textContent).toBe(
      'Based on 3 job postings (Acme, Globex, Initech), as seen Sep 2026.'
    );
    expect(block.querySelectorAll('li')).toHaveLength(3);
    expect(block.textContent).toContain('Globex · Widget Engineer II · Remote (EU/UK)');
    expect(block.querySelector('a')).toBeNull();
  });
});

describe('PostingEvidenceTable', () => {
  it('renders rows, a labelled sub-group per variant, and per-group skill counts', () => {
    render(<PostingEvidenceTable evidence={evidence} roleTitle="Widget Engineer" />);
    const block = screen.getByTestId('posting-evidence');

    expect(block.querySelectorAll('tbody')).toHaveLength(2);
    expect(block.querySelectorAll('tbody tr td:first-child')).toHaveLength(5);
    expect(screen.getByText('Widget Engineer postings')).toBeInTheDocument();
    expect(screen.getByText('Platform Engineer postings')).toBeInTheDocument();

    const counts = screen.getAllByTestId('skill-counts').map((el) => el.textContent);
    expect(counts).toEqual([
      'Widget Engineer: Python 3/3 · Evals 2/3 · Kubernetes 1/3',
      'Platform Engineer: Kubernetes 2/2 · Terraform 1/2',
    ]);
    expect(block.textContent).toContain('Snapshot of real postings as seen Sep 2026.');
    expect(block.querySelector('a')).toBeNull();
  });

  it('omits sub-group labels when there is only the main role', () => {
    const mainOnly = { ...evidence, postings: evidence.postings.slice(0, 3) };
    render(<PostingEvidenceTable evidence={mainOnly} roleTitle="Widget Engineer" />);
    expect(screen.queryByText('Widget Engineer postings')).toBeNull();
    expect(screen.getByTestId('skill-counts').textContent).toBe('Python 3/3 · Evals 2/3 · Kubernetes 1/3');
  });
});

describe('pages without posting evidence', () => {
  it('render nothing from either block', () => {
    const { container } = render(
      <>
        <PostingTrustLine evidence={undefined} />
        <PostingEvidenceTable evidence={undefined} roleTitle="Accountant" />
      </>
    );
    expect(container.innerHTML).toBe('');
  });
});

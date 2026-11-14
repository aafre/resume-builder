import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import runs from '../data/claudePromptRuns.json';
import ClaudePromptRun from '../components/blog/ClaudePromptRun';

const page = readFileSync(resolve(__dirname, '../components/blog/ClaudeResumePrompts.tsx'), 'utf-8');

describe('Claude prompt runs', () => {
  it('has a recorded run for every prompt on the page', () => {
    const onPage = [...page.matchAll(/title="Prompt #(\d+):/g)].map((m) => Number(m[1]));
    const embedded = [...page.matchAll(/<ClaudePromptRun n=\{(\d+)\} \/>/g)].map((m) => Number(m[1]));
    expect(onPage).toHaveLength(25);
    expect(embedded).toEqual(onPage);
    expect(runs.results.map((r) => r.n)).toEqual(onPage);
  });

  it('renders the exact prompt and output', () => {
    render(<ClaudePromptRun n={3} />);
    const r = runs.results.find((x) => x.n === 3)!;
    expect(screen.getByText(r.prompt.split('\n')[0], { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/See Claude's real output for prompt #3/)).toBeInTheDocument();
  });
});

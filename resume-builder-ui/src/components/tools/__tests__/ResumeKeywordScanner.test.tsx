import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModelStatusIndicator } from '../ResumeKeywordScanner';

// Regression test for the statusText crash: the prop was declared in the
// props type but missing from the destructuring pattern, so the loading
// branch's bare `statusText` reference threw a ReferenceError at runtime
// and unmounted the whole page. tsc -b catches this (TS2304), but the
// baseline `npx tsc --noEmit` checks zero files (solution-style root
// tsconfig), and no suite rendered this component — so it escaped.
describe('ModelStatusIndicator', () => {
  it('renders statusText during loading without crashing', () => {
    const statusText = 'Downloading AI model (one-time, ~23 MB)…';
    render(<ModelStatusIndicator status="loading" progress={42} statusText={statusText} />);

    expect(screen.getByText(statusText)).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });
});

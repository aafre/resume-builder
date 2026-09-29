// Editor sidebar /jobs links render optimistically, like the header link:
// only a definite "unsupported" answer hides them.
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

let jobsAvailable: boolean | null = null;
vi.mock('../../hooks/useJobsAvailable', () => ({ useJobsAvailable: () => jobsAvailable }));
vi.mock('../../config/affiliate', () => ({
  affiliateConfig: {
    resumeReview: { enabled: false, url: '', label: '', description: '' },
    jobSearch: { enabled: true },
  },
  hasAnyAffiliate: () => true,
}));

import SectionNavigator from '../SectionNavigator';

const noop = () => {};
function renderSidebar() {
  return render(
    <MemoryRouter>
      <SectionNavigator
        sections={[{ name: 'Experience', type: 'experience' }]}
        onSectionClick={noop}
        onAddSection={noop}
        onDownloadResume={noop}
        onExportYAML={noop}
        onImportYAML={noop}
        onStartFresh={noop}
        onHelp={noop}
      />
    </MemoryRouter>,
  );
}

const jobsLinks = () => screen.queryAllByRole('link').filter((a) => a.getAttribute('href') === '/jobs');

describe('editor sidebar jobs link', () => {
  beforeEach(() => {
    jobsAvailable = null;
  });

  it('shows while availability is loading', () => {
    renderSidebar();
    expect(jobsLinks().length).toBeGreaterThan(0);
  });

  it('shows when available', () => {
    jobsAvailable = true;
    renderSidebar();
    expect(jobsLinks().length).toBeGreaterThan(0);
  });

  it('hides on a definite unsupported answer', () => {
    jobsAvailable = false;
    renderSidebar();
    expect(jobsLinks()).toHaveLength(0);
  });
});

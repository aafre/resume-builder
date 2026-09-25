// Header and footer Jobs links render optimistically: only a definite
// "unsupported" answer hides them, so the header doesn't shift on first visit.
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

let jobsAvailable: boolean | null = null;
vi.mock('../hooks/useJobsAvailable', () => ({ useJobsAvailable: () => jobsAvailable }));
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isAnonymous: true,
    loading: false,
    showAuthModal: vi.fn(),
    hideAuthModal: vi.fn(),
    authModalOpen: false,
  }),
}));
vi.mock('../hooks/useResumeCount', () => ({ useResumeCount: () => ({ data: 0 }) }));

import Header from '../components/Header';
import Footer from '../components/Footer';

const jobsLinks = () => screen.queryAllByRole('link').filter((a) => a.getAttribute('href') === '/jobs');

function renderChrome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Header />
      <Footer />
    </MemoryRouter>,
  );
}

describe('Jobs links in header and footer', () => {
  beforeEach(() => {
    jobsAvailable = null;
  });

  it('show while the availability answer is still loading', () => {
    renderChrome();
    expect(jobsLinks().length).toBeGreaterThanOrEqual(2);
  });

  it('show when available', () => {
    jobsAvailable = true;
    renderChrome();
    expect(jobsLinks().length).toBeGreaterThanOrEqual(2);
  });

  it('hide on a definite unsupported answer', () => {
    jobsAvailable = false;
    renderChrome();
    expect(jobsLinks()).toHaveLength(0);
  });
});

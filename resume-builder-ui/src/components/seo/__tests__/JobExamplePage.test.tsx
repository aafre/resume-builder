import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { HelmetProvider } from 'react-helmet-async';
import JobExamplePage, { an } from '../JobExamplePage';

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ session: null, isAnonymous: true, isAuthenticated: false }),
}));
vi.mock('../../../hooks/useResumeCreate', () => ({
  useResumeCreate: () => ({ createResume: vi.fn(), creating: false }),
}));

// A real, pre-R1 example: no postingEvidence, no roleVariant.
const yaml = readFileSync(resolve(__dirname, '../../../../public/examples/accountant.yml'), 'utf8');

describe('JobExamplePage without R1 fields', () => {
  it('renders unchanged: no posting evidence or role-variant blocks', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(yaml)));
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/examples/accountant']}>
          <Routes>
            <Route path="/examples/:slug" element={<JobExamplePage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.queryByTestId('posting-trust-line')).toBeNull();
    expect(screen.queryByTestId('posting-evidence')).toBeNull();
    expect(screen.queryByText(/Applying for .* roles\?/)).toBeNull();
    vi.unstubAllGlobals();
  });
});

describe('an', () => {
  it('picks the article by sound', () => {
    expect(['Accountant', 'MLOps Engineer', 'HVAC Technician', 'Electrician'].map(an)).toEqual(['an', 'an', 'an', 'an']);
    expect(['Software Engineer', 'High School Student', 'Human Resources Generalist', 'Receptionist'].map(an)).toEqual(['a', 'a', 'a', 'a']);
  });
});

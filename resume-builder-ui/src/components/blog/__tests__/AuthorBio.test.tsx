// src/components/blog/__tests__/AuthorBio.test.tsx
// Protected pages must keep the pre-rebrand author bio byte-identical (legacy=true).

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthorBio from '../AuthorBio';

describe('AuthorBio', () => {
  it('renders the current Amit bio by default', () => {
    render(
      <MemoryRouter>
        <AuthorBio />
      </MemoryRouter>
    );

    expect(screen.getByText('Amit')).toBeInTheDocument();
    expect(
      screen.getByText('Amit builds and maintains EasyFreeResume.')
    ).toBeInTheDocument();
  });

  it('renders the legacy team bio when legacy=true (protected pages)', () => {
    render(
      <MemoryRouter>
        <AuthorBio legacy />
      </MemoryRouter>
    );

    expect(screen.getByText('The EasyFreeResume Team')).toBeInTheDocument();
    expect(
      screen.getByText(
        "We're a team of career coaches, HR professionals, and developers dedicated to making professional resume building accessible to everyone — completely free, no strings attached."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText('Amit')).not.toBeInTheDocument();
  });
});

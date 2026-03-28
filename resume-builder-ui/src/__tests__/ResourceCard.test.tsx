/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResourceCard from '../components/shared/ResourceCard';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ResourceCard', () => {
  it('renders title and description', () => {
    renderWithRouter(
      <ResourceCard
        to="/resume-keywords/nursing"
        title="Nursing Keywords"
        description="BLS, ACLS, Epic"
      />
    );
    expect(screen.getByText('Nursing Keywords')).toBeInTheDocument();
    expect(screen.getByText('BLS, ACLS, Epic')).toBeInTheDocument();
  });

  it('renders as a link to the correct path', () => {
    renderWithRouter(
      <ResourceCard
        to="/examples/software-engineer"
        title="Software Engineer"
        description="Full resume example"
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/examples/software-engineer');
  });

  it('applies the expected card styling', () => {
    renderWithRouter(
      <ResourceCard to="/test" title="Test" description="Desc" />
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('bg-chalk-dark');
    expect(link.className).toContain('rounded-xl');
    expect(link.className).toContain('hover:bg-white');
  });

  it('renders title in an h3 element', () => {
    renderWithRouter(
      <ResourceCard to="/test" title="My Title" description="Desc" />
    );
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('My Title');
  });
});

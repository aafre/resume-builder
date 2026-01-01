/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import JobKeywordsPage from '../components/seo/JobKeywordsPage';
import { HelmetProvider } from 'react-helmet-async';

// Mock the job data to avoid dependency on actual data
vi.mock('../data/jobKeywords', () => ({
  getJobBySlug: (slug: string) => {
    if (slug === 'software-engineer') {
      return {
        slug: 'software-engineer',
        title: 'Software Engineer',
        metaTitle: 'Software Engineer Resume Keywords - ATS-Optimized',
        metaDescription: 'Complete list of software engineer keywords',
        category: 'technology' as const,
        priority: 0.9,
        lastmod: '2026-01-01',
        keywords: {
          core: ['Problem Solving', 'Team Collaboration', 'Communication'],
          technical: ['JavaScript', 'Python', 'React', 'Node.js', 'Docker'],
          processes: ['Agile/Scrum', 'CI/CD', 'Code Reviews'],
          certifications: ['AWS Certified Developer'],
        },
        tools: [
          { category: 'Programming Languages', items: ['Python', 'JavaScript'] },
          { category: 'Frameworks', items: ['React', 'Node.js'] },
        ],
        example: {
          before: 'Worked on software projects and helped the team deliver features on time.',
          after: 'Developed scalable microservices using Python and React, implementing CI/CD pipelines with Docker and Kubernetes, reducing deployment time by 40% and increasing system reliability to 99.9% uptime.',
        },
      };
    }
    return undefined;
  },
}));

// Wrapper component for all providers
const TestWrapper = ({ children, initialRoute = '/resume-keywords/software-engineer' }) => (
  <HelmetProvider>
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/resume-keywords/:jobSlug" element={children} />
        <Route path="/404" element={<div>Not Found Page</div>} />
      </Routes>
    </MemoryRouter>
  </HelmetProvider>
);

describe('JobKeywordsPage', () => {
  it('should render for valid job slug', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    // Use getByRole to find the H1 heading specifically
    const heading = screen.getByRole('heading', { level: 1, name: /Software Engineer Resume Keywords/i });
    expect(heading).toBeInTheDocument();
  });

  it('should redirect to 404 for invalid job slug', () => {
    render(
      <TestWrapper initialRoute="/resume-keywords/invalid-job-slug">
        <JobKeywordsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });

  it('should display job title in H1', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    const h1 = screen.getByRole('heading', { level: 1, name: /Software Engineer Resume Keywords/i });
    expect(h1).toBeInTheDocument();
  });

  it('should render hub navigation link', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    // Find link to resume keywords hub in breadcrumbs
    const hubLink = screen.getByRole('link', { name: /Resume Keywords$/i });
    expect(hubLink).toHaveAttribute('href', '/resume-keywords');
  });

  it('should render core skills section', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { level: 2, name: /Core.*skills/i })).toBeInTheDocument();
    // Verify at least one core skill is present
    const skills = screen.getAllByText('Problem Solving');
    expect(skills.length).toBeGreaterThan(0);
  });

  it('should render technical skills section', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { level: 2, name: /Technical skills/i })).toBeInTheDocument();
    // Verify at least one technical skill is present
    const skills = screen.getAllByText('JavaScript');
    expect(skills.length).toBeGreaterThan(0);
  });

  it('should render tools section when tools data is available', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Programming Languages')).toBeInTheDocument();
    expect(screen.getByText('Frameworks')).toBeInTheDocument();
  });

  it('should render processes section', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { level: 2, name: /Methodologies and processes/i })).toBeInTheDocument();
    // Verify at least one process is present
    const processes = screen.getAllByText('Agile/Scrum');
    expect(processes.length).toBeGreaterThan(0);
  });

  it('should render certifications section', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/Relevant certifications/i)).toBeInTheDocument();
    expect(screen.getByText('AWS Certified Developer')).toBeInTheDocument();
  });

  it('should render before/after examples section', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    expect(screen.getByText(/How to use these keywords: examples/i)).toBeInTheDocument();
    expect(screen.getByText(/Generic \(Before\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Optimized \(After\)/i)).toBeInTheDocument();
  });

  it('should render FAQ section', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    // FAQ section should be present
    const faqSection = screen.getByText(/What are the most important.*keywords\?/i);
    expect(faqSection).toBeInTheDocument();
  });

  it('should render CTA link', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    // Find any link to the editor (CTA)
    const ctaLinks = screen.getAllByRole('link');
    const editorLink = ctaLinks.find(link => link.getAttribute('href') === '/editor');
    expect(editorLink).toBeInTheDocument();
  });

  it('should render breadcrumbs', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    // Check for breadcrumb links
    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render all major page sections', () => {
    render(
      <TestWrapper>
        <JobKeywordsPage />
      </TestWrapper>
    );

    // Verify key sections are present
    expect(screen.getByRole('heading', { level: 2, name: /Core.*skills/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Technical skills/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Methodologies and processes/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Relevant certifications/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /How to use these keywords/i })).toBeInTheDocument();
  });
});

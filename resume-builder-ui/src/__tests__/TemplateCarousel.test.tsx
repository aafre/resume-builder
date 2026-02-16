import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TemplateCarousel from '../components/TemplateCarousel';
import { fetchTemplates } from '../services/templates';

// Mock dependencies
vi.mock('../services/templates', () => ({
  fetchTemplates: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    session: null,
    isAnonymous: true,
    isAuthenticated: false,
    anonMigrationInProgress: false,
  }),
}));

vi.mock('../hooks/useResumeCreate', () => ({
  useResumeCreate: () => ({
    createResume: vi.fn(),
    creating: false,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock child components to isolate the test
vi.mock('../components/TemplateStartModal', () => ({ default: () => <div data-testid="start-modal" /> }));
vi.mock('../components/ResumeRecoveryModal', () => ({ default: () => <div data-testid="recovery-modal" /> }));
vi.mock('../components/AuthModal', () => ({ default: () => <div data-testid="auth-modal" /> }));
vi.mock('../components/ads', () => ({
  InFeedAd: () => <div data-testid="in-feed-ad" />,
  AD_CONFIG: { slots: { carouselInfeed: 'test-slot' } },
}));

const mockTemplates = [
  { id: '1', name: 'Template 1', description: 'Desc 1', image_url: '/img1.png' },
  { id: '2', name: 'Template 2', description: 'Desc 2', image_url: '/img2.png' },
  { id: '3', name: 'Template 3', description: 'Desc 3', image_url: '/img3.png' },
  { id: '4', name: 'Template 4', description: 'Desc 4', image_url: '/img4.png' },
];

describe('TemplateCarousel Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchTemplates as ReturnType<typeof vi.fn>).mockResolvedValue(mockTemplates);
  });

  it('renders images with correct loading strategies', async () => {
    render(<TemplateCarousel />);

    await waitFor(() => {
      expect(screen.getByText('Template 1')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');

    // First 2 images should be eager
    expect(images[0]).toHaveAttribute('loading', 'eager');
    expect(images[1]).toHaveAttribute('loading', 'eager');

    // Subsequent images should be lazy
    expect(images[2]).toHaveAttribute('loading', 'lazy');
    expect(images[3]).toHaveAttribute('loading', 'lazy');

    // All images should decode asynchronously
    images.forEach(img => {
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });
});

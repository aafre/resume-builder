import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TemplateCarousel from '../components/TemplateCarousel';
import { fetchTemplates } from '../services/templates';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

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

vi.mock('../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
  },
}));

// Mock ad components to avoid complexity
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

describe('TemplateCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchTemplates as ReturnType<typeof vi.fn>).mockResolvedValue(mockTemplates);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders images with correct loading attributes', async () => {
    render(
      <MemoryRouter>
        <TemplateCarousel />
      </MemoryRouter>
    );

    // Wait for templates to load
    await waitFor(() => {
      expect(screen.getByAltText('Template 1')).toBeInTheDocument();
    });

    const img1 = screen.getByAltText('Template 1');
    const img2 = screen.getByAltText('Template 2');
    const img3 = screen.getByAltText('Template 3');
    const img4 = screen.getByAltText('Template 4');

    // First 2 should be eager
    expect(img1).toHaveAttribute('loading', 'eager');
    expect(img2).toHaveAttribute('loading', 'eager');

    // Rest should be lazy
    expect(img3).toHaveAttribute('loading', 'lazy');
    expect(img4).toHaveAttribute('loading', 'lazy');

    // All should have decoding="async"
    expect(img1).toHaveAttribute('decoding', 'async');
    expect(img3).toHaveAttribute('decoding', 'async');
  });
});

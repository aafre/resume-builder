import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TemplateSelectionModal, { Template } from '../components/TemplateSelectionModal';

// Mock fetchTemplates
vi.mock('../services/templates', () => ({
  fetchTemplates: vi.fn(),
}));

import { fetchTemplates } from '../services/templates';

const mockTemplates: Template[] = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design', image_url: '/modern.png' },
  { id: 'professional', name: 'Professional', description: 'Traditional business style', image_url: '/professional.png' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated and refined', image_url: '/elegant.png' },
  { id: 'minimalist', name: 'Minimalist', description: 'Simple and focused', image_url: '/minimalist.png' },
];

describe('TemplateSelectionModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (fetchTemplates as ReturnType<typeof vi.fn>).mockResolvedValue(mockTemplates);
  });

  afterEach(() => {
    cleanup();
  });

  it('does not render when isOpen is false', () => {
    render(<TemplateSelectionModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('template-selection-modal')).not.toBeInTheDocument();
  });

  it('renders modal when isOpen is true', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-modal')).toBeInTheDocument();
    });
    expect(screen.getByText('Choose Your Style')).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    // Loading state shows immediately
    expect(screen.getByTestId('template-selection-loading')).toBeInTheDocument();
    expect(screen.getByText('Loading templates...')).toBeInTheDocument();

    // Wait for templates to load to allow cleanup
    await waitFor(() => {
      expect(screen.queryByTestId('template-selection-loading')).not.toBeInTheDocument();
    });
  });

  it('displays templates after loading', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-grid')).toBeInTheDocument();
    });

    expect(screen.getByText('Modern')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Elegant')).toBeInTheDocument();
    expect(screen.getByText('Minimalist')).toBeInTheDocument();
  });

  it('selects first template by default', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-option-modern')).toBeInTheDocument();
    });

    // First template should be selected
    expect(screen.getByTestId('template-selected-modern')).toBeInTheDocument();
    expect(screen.getByTestId('template-option-modern')).toHaveAttribute('aria-pressed', 'true');
  });

  it('allows selecting a different template', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-option-professional')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('template-option-professional'));

    expect(screen.getByTestId('template-selected-professional')).toBeInTheDocument();
    expect(screen.getByTestId('template-option-professional')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByTestId('template-selected-modern')).not.toBeInTheDocument();
  });

  it('calls onSelect with selected template when Use This Style is clicked', async () => {
    const onSelect = vi.fn();
    render(<TemplateSelectionModal {...defaultProps} onSelect={onSelect} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-option-elegant')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('template-option-elegant'));
    fireEvent.click(screen.getByTestId('template-selection-continue'));

    expect(onSelect).toHaveBeenCalledWith('elegant');
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<TemplateSelectionModal {...defaultProps} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-close')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('template-selection-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(<TemplateSelectionModal {...defaultProps} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-modal-backdrop')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('template-selection-modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', async () => {
    const onClose = vi.fn();
    render(<TemplateSelectionModal {...defaultProps} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-modal')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('template-selection-modal'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    render(<TemplateSelectionModal {...defaultProps} onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-modal-backdrop')).toBeInTheDocument();
    });

    fireEvent.keyDown(screen.getByTestId('template-selection-modal-backdrop'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows error state when templates fail to load', async () => {
    (fetchTemplates as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-error')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to load templates. Please try again.')).toBeInTheDocument();
  });

  it('retries loading templates when Try Again is clicked', async () => {
    (fetchTemplates as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockTemplates);

    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-error')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Try Again'));

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-grid')).toBeInTheDocument();
    });

    expect(fetchTemplates).toHaveBeenCalledTimes(2);
  });

  it('uses initialTemplateId when provided', async () => {
    render(<TemplateSelectionModal {...defaultProps} initialTemplateId="elegant" />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-grid')).toBeInTheDocument();
    });

    expect(screen.getByTestId('template-selected-elegant')).toBeInTheDocument();
    expect(screen.queryByTestId('template-selected-modern')).not.toBeInTheDocument();
  });

  it('disables Continue button while loading', async () => {
    // Delay the promise to ensure we can check loading state
    (fetchTemplates as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockTemplates), 100))
    );

    render(<TemplateSelectionModal {...defaultProps} />);

    const continueButton = screen.getByTestId('template-selection-continue');
    expect(continueButton).toBeDisabled();

    // Wait for templates to load
    await waitFor(() => {
      expect(screen.getByTestId('template-selection-grid')).toBeInTheDocument();
    });
  });

  it('works with _testTemplates prop for testing', async () => {
    const testTemplates: Template[] = [
      { id: 'test1', name: 'Test 1', description: 'Test description 1', image_url: '/test1.png' },
      { id: 'test2', name: 'Test 2', description: 'Test description 2', image_url: '/test2.png' },
    ];

    render(<TemplateSelectionModal {...defaultProps} _testTemplates={testTemplates} />);

    // With test templates, loading is skipped
    await waitFor(() => {
      expect(screen.getByTestId('template-selection-grid')).toBeInTheDocument();
    });

    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(fetchTemplates).not.toHaveBeenCalled();
  });

  it('renders template images with correct alt text', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-grid')).toBeInTheDocument();
    });

    expect(screen.getByAltText('Modern')).toBeInTheDocument();
    expect(screen.getByAltText('Professional')).toBeInTheDocument();
  });

  it('has accessible dialog role and aria attributes', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'template-selection-modal-title');
  });

  it('displays "Best for" taglines for known templates', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-grid')).toBeInTheDocument();
    });

    expect(screen.getByTestId('template-bestfor-modern')).toHaveTextContent('Best for tech & startups');
    expect(screen.getByTestId('template-bestfor-professional')).toHaveTextContent('Best for corporate & finance');
    expect(screen.getByTestId('template-bestfor-elegant')).toHaveTextContent('Best for creative & design');
    expect(screen.getByTestId('template-bestfor-minimalist')).toHaveTextContent('Best for academia & research');
  });

  it('shows "Use This Style" as the CTA button text', async () => {
    render(<TemplateSelectionModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('template-selection-continue')).toBeInTheDocument();
    });

    expect(screen.getByTestId('template-selection-continue')).toHaveTextContent('Use This Style');
  });
});

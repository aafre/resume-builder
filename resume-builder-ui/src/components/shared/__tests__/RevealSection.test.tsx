import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RevealSection from '../RevealSection';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor() {}
  observe = mockObserve;
  unobserve = vi.fn();
  disconnect = mockDisconnect;
}

const mockMatchMedia = vi.fn();

describe('RevealSection', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    mockMatchMedia.mockReturnValue({ matches: false });
    vi.stubGlobal('matchMedia', mockMatchMedia);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders children', () => {
    render(
      <RevealSection>
        <p>Hello World</p>
      </RevealSection>,
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('sets data-reveal attribute with default variant', () => {
    const { container } = render(
      <RevealSection>
        <p>Content</p>
      </RevealSection>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute('data-reveal')).toBe('fade-up');
  });

  it('sets data-reveal attribute with custom variant', () => {
    const { container } = render(
      <RevealSection variant="scale-in">
        <p>Content</p>
      </RevealSection>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute('data-reveal')).toBe('scale-in');
  });

  it('adds data-reveal-stagger when stagger prop is true', () => {
    const { container } = render(
      <RevealSection stagger>
        <p>Content</p>
      </RevealSection>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.hasAttribute('data-reveal-stagger')).toBe(true);
  });

  it('does not add data-reveal-stagger when stagger prop is false', () => {
    const { container } = render(
      <RevealSection>
        <p>Content</p>
      </RevealSection>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.hasAttribute('data-reveal-stagger')).toBe(false);
  });

  it('forwards className', () => {
    const { container } = render(
      <RevealSection className="my-custom-class">
        <p>Content</p>
      </RevealSection>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.classList.contains('my-custom-class')).toBe(true);
  });

  it('forwards additional HTML attributes', () => {
    const { container } = render(
      <RevealSection data-testid="reveal" aria-label="section">
        <p>Content</p>
      </RevealSection>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute('data-testid')).toBe('reveal');
    expect(wrapper.getAttribute('aria-label')).toBe('section');
  });

  it('observes the element with IntersectionObserver', () => {
    render(
      <RevealSection>
        <p>Content</p>
      </RevealSection>,
    );

    expect(mockObserve).toHaveBeenCalled();
  });
});

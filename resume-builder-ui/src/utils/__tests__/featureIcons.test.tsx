import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeatureIcon } from '../featureIcons';

describe('FeatureIcon', () => {
  it('renders a mapped emoji as an SVG icon', () => {
    const { container } = render(<FeatureIcon emoji="✅" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not render raw emoji text for mapped emojis', () => {
    const { container } = render(<FeatureIcon emoji="🎯" />);
    expect(container.querySelector('span')).toBeNull();
  });

  it('renders unmapped emoji in a fallback container with text', () => {
    render(<FeatureIcon emoji="🦄" />);
    expect(screen.getByText('🦄')).toBeInTheDocument();
  });

  it('renders mapped icons in ink, not a per-index colour', () => {
    const { container } = render(<FeatureIcon emoji="✅" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('text-ink');
  });

  // Verify all 31 mapped emojis render as SVG (no fallback)
  const mappedEmojis = [
    '✅', '🎨', '📥', '🔒', '✏️', '💰', '🎁', '✨', '🚫', '📋',
    '🤖', '💼', '📱', '💡', '📈', '💬', '📝', '⚡', '🎯', '💾',
    '🇬🇧', '📄', '🔤', '📏', '📐', '📅', '📊', '🔄', '🎓', '🏆', '🎧',
  ];

  it.each(mappedEmojis)('maps emoji %s to an SVG icon', (emoji) => {
    const { container } = render(<FeatureIcon emoji={emoji} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeatureIcon, getColorTheme } from '../featureIcons';

describe('FeatureIcon', () => {
  it('renders a mapped emoji as an SVG icon', () => {
    const { container } = render(<FeatureIcon emoji="✅" index={0} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not render raw emoji text for mapped emojis', () => {
    const { container } = render(<FeatureIcon emoji="🎯" index={0} />);
    expect(container.querySelector('span')).toBeNull();
  });

  it('renders unmapped emoji in a fallback container with text', () => {
    render(<FeatureIcon emoji="🦄" index={0} />);
    expect(screen.getByText('🦄')).toBeInTheDocument();
  });

  it('fallback container has neutral gradient classes', () => {
    const { container } = render(<FeatureIcon emoji="🦄" index={0} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('from-gray-50');
    expect(wrapper.className).toContain('to-slate-50');
  });

  it('applies blue theme for index 0', () => {
    const { container } = render(<FeatureIcon emoji="✅" index={0} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('from-blue-50');
    expect(wrapper.className).toContain('to-indigo-50');
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('text-blue-600');
  });

  it('applies purple theme for index 1', () => {
    const { container } = render(<FeatureIcon emoji="🎨" index={1} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('from-purple-50');
  });

  it('cycles colors: index 6 === index 0 (blue)', () => {
    const { container } = render(<FeatureIcon emoji="📥" index={6} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('from-blue-50');
  });

  it('includes motion-reduce overrides on the icon container', () => {
    const { container } = render(<FeatureIcon emoji="⚡" index={0} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('motion-reduce:group-hover:scale-100');
    expect(wrapper.className).toContain('motion-reduce:group-hover:rotate-0');
  });

  it('includes hover transform classes', () => {
    const { container } = render(<FeatureIcon emoji="🎁" index={0} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('group-hover:scale-110');
    expect(wrapper.className).toContain('group-hover:rotate-3');
  });

  // Verify all 31 mapped emojis render as SVG (no fallback)
  const mappedEmojis = [
    '✅', '🎨', '📥', '🔒', '✏️', '💰', '🎁', '✨', '🚫', '📋',
    '🤖', '💼', '📱', '💡', '📈', '💬', '📝', '⚡', '🎯', '💾',
    '🇬🇧', '📄', '🔤', '📏', '📐', '📅', '📊', '🔄', '🎓', '🏆', '🎧',
  ];

  it.each(mappedEmojis)('maps emoji %s to an SVG icon', (emoji) => {
    const { container } = render(<FeatureIcon emoji={emoji} index={0} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('getColorTheme', () => {
  it('returns 6 distinct themes for indices 0-5', () => {
    const themes = Array.from({ length: 6 }, (_, i) => getColorTheme(i));
    const uniqueBgs = new Set(themes.map((t) => t.bg));
    expect(uniqueBgs.size).toBe(6);
  });

  it('wraps around after 6', () => {
    expect(getColorTheme(0)).toEqual(getColorTheme(6));
    expect(getColorTheme(1)).toEqual(getColorTheme(7));
    expect(getColorTheme(5)).toEqual(getColorTheme(11));
  });
});

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Odometer } from '../Odometer';

describe('Odometer', () => {
  it('rolls digits and keeps symbols static, labelled once', () => {
    const { container } = render(<Odometer value="100%" />);
    expect(container.querySelectorAll('.odo-d')).toHaveLength(3);
    expect(container.querySelector('.odo-s')!.textContent).toBe('%');
    expect(container.querySelector('.odo')!.getAttribute('aria-label')).toBe('100%');
  });

  it('treats ∞ as a drum column that lands past the digits', () => {
    const { container } = render(<Odometer value="∞" />);
    const inf = container.querySelector('.odo-inf') as HTMLElement;
    expect(inf.textContent).toBe('∞');
    expect(inf.style.getPropertyValue('--t')).toBe('3');
  });
});

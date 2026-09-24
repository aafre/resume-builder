import { act, createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Odometer, ResumeCount } from '../Odometer';
import { getResumeCount } from '../../config/resumeCount';

const label = (n: number) => `${n.toLocaleString('en-US')}+`;
const buildValue = () => getResumeCount(Date.parse(__BUILD_DATE__));

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// Server HTML is made on the build day; the client hydrates `daysLater`.
function hydrateCount(daysLater = 3) {
  vi.useFakeTimers({ now: Date.parse(__BUILD_DATE__) });
  const html = renderToString(<ResumeCount bandRef={createRef()} />);
  vi.setSystemTime(Date.parse(__BUILD_DATE__) + daysLater * 86_400_000);
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();
  act(() => {
    hydrateRoot(container, <ResumeCount bandRef={createRef()} />, { onRecoverableError });
  });
  return { html, container, onRecoverableError, odo: container.querySelector('.odo')! };
}

describe('ResumeCount', () => {
  it('prerenders the build value as stale', () => {
    const html = renderToString(<ResumeCount bandRef={createRef()} />);
    expect(html).toContain(`aria-label="${label(buildValue())}"`);
    expect(html).toContain('data-stale');
  });

  it('hydrates cleanly, then shows the current value', () => {
    const { onRecoverableError, odo } = hydrateCount();
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(odo.getAttribute('aria-label')).toBe(label(getResumeCount(Date.now())));
    expect(odo.hasAttribute('data-stale')).toBe(false);
  });

  it('keeps the build value under the prerender UA', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('EasyFreeResume-Prerender/1.0');
    const { odo } = hydrateCount();
    expect(odo.getAttribute('aria-label')).toBe(label(buildValue()));
    expect(odo.hasAttribute('data-stale')).toBe(true);
  });

  it('ticks up over time', () => {
    const { odo } = hydrateCount(1);
    const before = Number(odo.getAttribute('aria-label')!.replace(/\D/g, ''));
    act(() => { vi.advanceTimersByTime(10 * 60_000); });
    const after = Number(odo.getAttribute('aria-label')!.replace(/\D/g, ''));
    expect(after).toBeGreaterThan(before);
  });
});

describe('Odometer tick', () => {
  it('remounts and rolls only the changed digits', () => {
    const { container, rerender } = render(<Odometer value="150,519+" />);
    const before = [...container.querySelectorAll('.odo-d')];
    rerender(<Odometer value="150,520+" from="150,519+" />);
    const after = [...container.querySelectorAll('.odo-d')] as HTMLElement[];
    before.slice(0, 4).forEach((n, i) => expect(after[i]).toBe(n));
    expect(after[4]).not.toBe(before[4]);
    expect(after[5]).not.toBe(before[5]);
    expect(after[4].style.getPropertyValue('--p')).toBe('1');
    expect(after[5].style.getPropertyValue('--p')).toBe('9');
    expect(after[5].style.getPropertyValue('--t')).toBe('1');
  });
});

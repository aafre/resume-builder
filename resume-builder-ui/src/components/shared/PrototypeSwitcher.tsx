// PROTOTYPE: throwaway variant switcher. Lives only on prototype/* branches.
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePrototypeVariant(keys: string[]): string {
  const [params] = useSearchParams();
  const v = params.get('variant') ?? keys[0];
  return keys.includes(v) ? v : keys[0];
}

export default function PrototypeSwitcher({ variants }: { variants: { key: string; name: string }[] }) {
  const [params, setParams] = useSearchParams();
  const keys = variants.map((v) => v.key);
  const current = usePrototypeVariant(keys);
  const i = keys.indexOf(current);

  const go = (delta: number) => {
    const next = keys[(i + delta + keys.length) % keys.length];
    const p = new URLSearchParams(params);
    p.set('variant', next);
    setParams(p, { replace: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest('input, textarea, [contenteditable="true"]'))) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 rounded-full bg-[#ff00aa] text-white px-4 py-2 shadow-2xl font-mono text-sm">
      <button onClick={() => go(-1)} aria-label="Previous variant">←</button>
      <span>PROTOTYPE {current} · {variants[i].name}</span>
      <button onClick={() => go(1)} aria-label="Next variant">→</button>
    </div>
  );
}

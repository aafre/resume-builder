import type { HTMLAttributes } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

type RevealVariant = 'fade-up' | 'fade-in' | 'scale-in';

interface RevealSectionProps extends HTMLAttributes<HTMLDivElement> {
  variant?: RevealVariant;
  stagger?: boolean;
}

/**
 * Declarative scroll-reveal wrapper. Adds data-reveal attribute for CSS
 * animations and uses IntersectionObserver to toggle the 'revealed' class.
 */
export default function RevealSection({
  variant = 'fade-up',
  stagger = false,
  className = '',
  children,
  ...rest
}: RevealSectionProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-reveal={variant}
      {...(stagger ? { 'data-reveal-stagger': '' } : {})}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}

import React from 'react';
import { MdAdd } from 'react-icons/md';

export interface GhostButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text */
  children: React.ReactNode;
  /** Custom icon (defaults to MdAdd) */
  icon?: React.ReactNode;
}

/**
 * GhostButton Component
 *
 * A full-width dashed border button for "Add" actions.
 * Provides a subtle, non-intrusive way to add new items.
 *
 * @example
 * ```tsx
 * <GhostButton onClick={handleAddItem}>
 *   Add Experience
 * </GhostButton>
 * ```
 */
export const GhostButton: React.FC<GhostButtonProps> = ({
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        w-full py-3 px-4
        flex items-center justify-center gap-2
        border-2 border-dashed border-gray-300 rounded-lg
        text-gray-500 text-sm font-medium
        bg-transparent
        hover:border-accent/70 hover:text-accent hover:bg-accent/[0.06]
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-500 disabled:hover:bg-transparent
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {icon ?? <MdAdd className="text-lg" />}
      <span>{children}</span>
    </button>
  );
};

export default GhostButton;

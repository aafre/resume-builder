import React from 'react';

export type ActionIconVariant = 'neutral' | 'danger';
export type ActionIconSize = 'sm' | 'md';

export interface ActionIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon to render (React node, typically from react-icons) */
  icon: React.ReactNode;
  /** Visual variant */
  variant?: ActionIconVariant;
  /** Size of the button */
  size?: ActionIconSize;
  /** Accessible label (also used as tooltip) */
  label: string;
}

const variantStyles: Record<ActionIconVariant, string> = {
  neutral: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
  danger: 'text-gray-400 hover:text-red-600 hover:bg-red-50',
};

const sizeStyles: Record<ActionIconSize, string> = {
  sm: 'p-1 text-sm',
  md: 'p-1.5 text-base',
};

/**
 * ActionIcon Component
 *
 * A minimal icon button with consistent hover states.
 * Used for inline actions like delete, edit, drag handles.
 *
 * @example
 * ```tsx
 * <ActionIcon
 *   icon={<MdDelete />}
 *   variant="danger"
 *   size="sm"
 *   label="Delete item"
 *   onClick={handleDelete}
 * />
 * ```
 */
export const ActionIcon: React.FC<ActionIconProps> = ({
  icon,
  variant = 'neutral',
  size = 'md',
  label,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-md transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {icon}
    </button>
  );
};

export default ActionIcon;
